module Update exposing (update, urlUpdate)

import Debug
import Hop.Types exposing (Location)
import Http
import Task

import Types exposing (..)
import Messages exposing (..)
import Models exposing (..)
import Ports exposing (..)
import Routing
import Budgets.Commands exposing (fetchAllBudgets)
import BudgetItems.Commands exposing (fetchAllItems, createItem, saveItem, deleteItem)
import BudgetItems.Form exposing (..)
import Form exposing (Form)

update : Msg -> Model -> (Model, Cmd Msg)
update action model =
  case (Debug.log "action" action) of
    -- Init
    Init ->
      let cmd = Task.map2 (,) fetchAllBudgets fetchAllItems
                  |> Task.perform InitFail InitDone
      in (model, cmd)
    InitDone (budgets, items) ->
      let updated = { model | budgets = budgets, budgetItems = items }
          cmd =
            case List.head items of
              Just item ->
                Routing.navigateTo <| "#/budgets/" ++ (toString item.id)
              Nothing ->
                Cmd.none
      in (updated, cmd)
    InitFail error ->
      showError error model
    -- Budgets
    ShowBudget id ->
      (model, Routing.navigateTo <| "#/budgets/" ++ (toString id))
    -- Budget Items
    CreateItem budgetId ->
      let cmd = newItem budgetId
                  |> createItem
                  |> Task.perform CreateItemFail CreateItemDone
      in (model, cmd)
    CreateItemDone item ->
      let updated = { model | budgetItems = item :: model.budgetItems }
      in (updated, sendCommand <| EditItem item)
    CreateItemFail error ->
      showError error model
    EditItem item ->
      let path = "#/budgetItems/" ++ (toString item.id) ++ "/edit"
          -- TODO: Do this in routing so that this works with only URL change.
          updated = { model | budgetItemForm = makeItemForm item }
      in (updated, Routing.navigateTo path)
    DeleteItemIntent item ->
      let message = "Are you sure you want to delete " ++ item.label ++ "?"
      in (model, askConfirmation (item.id, message))
    DeleteItem id ->
      let cmd = deleteItem id
                  |> Task.perform DeleteItemFail DeleteItemDone
      in (model, cmd)
    DeleteItemDone id ->
      let (removed, remaining) = List.partition (\x -> x.id == id) model.budgetItems
          cmd = case List.head removed of
            Just item ->
              sendCommand <| ShowBudget item.budgetId
            Nothing ->
              Cmd.none
      in ({ model | budgetItems = remaining }, cmd)
    DeleteItemFail error ->
      showError error model
    ItemFormMsg formCmd ->
      ({ model | budgetItemForm = Form.update formCmd model.budgetItemForm }, Cmd.none)
    SaveItem ->
      case Form.getOutput (Debug.log "form output" model.budgetItemForm) of
        -- TODO: Clear form?
        Just item ->
          let cmd = saveItem item
                      |> Task.perform SaveItemFail SaveItemDone
          in (model, cmd)
        Nothing ->
          (model, Cmd.none)
    SaveItemDone item ->
      let replaceItem x = if x.id == item.id then item else x
          updatedCollection = List.map replaceItem model.budgetItems
      in ( { model | budgetItems = updatedCollection }, Routing.navigateTo "#/budgetItems")
    SaveItemFail error ->
      showError error model

urlUpdate : (Route, Location) -> Model -> (Model, Cmd Msg)
urlUpdate (route, location) model =
  let _ = Debug.log "route" (route, location, model.route)
  in ({ model | route = route, location = location }, Cmd.none)

-- Show error message.
showError : Http.Error -> Model -> (Model, Cmd Msg)
showError error model =
  ({ model | errorMessage = Just (toString error) }, Cmd.none)
