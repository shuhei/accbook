module Update exposing (update, urlUpdate)

import Debug
import Hop.Types exposing (Location)

import Types exposing (..)
import Messages exposing (..)
import Models exposing (..)
import Ports exposing (..)
import Routing
import BudgetItems.Commands exposing (createItem, saveItem, deleteItem)
import BudgetItems.Form exposing (..)
import Form exposing (Form)

update : Msg -> AppModel -> (AppModel, Cmd Msg)
update action model =
  case (Debug.log "action" action) of
    ShowError error ->
      ({ model | errorMessage = Just error }, Cmd.none)
    -- Budgets
    ShowBudget id ->
      let path = "#/budgets/" ++ (toString id)
      in (model, Routing.navigateTo path)
    FetchAllBudgetsDone budgets ->
      ({ model | budgets = budgets }, Cmd.none)
    FetchAllBudgetsFail error ->
      (model, sendError error)
    -- Budget Items
    ListAllItems ->
      (model, Routing.navigateTo "#/budgetItems")
    FetchAllItemsDone fetchedItems ->
      ({ model | budgetItems = fetchedItems }, Cmd.none)
    FetchAllItemsFail error ->
      (model, sendError error)
    CreateItem ->
      (model, createItem newItem)
    CreateItemDone item ->
      let updatedModel = { model | budgetItems = item :: model.budgetItems }
      in (updatedModel, sendCommand <| EditItem item)
    CreateItemFail error ->
      (model, sendError error)
    EditItem item ->
      let path = "#/budgetItems/" ++ (toString item.id) ++ "/edit"
          -- TODO: Do this in routing so that this works with only URL change.
          updatedModel = { model | budgetItemForm = makeItemForm item }
      in (updatedModel, Routing.navigateTo path)
    DeleteItemIntent item ->
      let message = "Are you sure you want to delete " ++ item.label ++ "?"
      in (model, askConfirmation (item.id, message))
    DeleteItem id ->
      (model, deleteItem id)
    DeleteItemDone id ->
      let updatedModel =
        { model | budgetItems = List.filter (\x -> x.id /= id) model.budgetItems }
      in (updatedModel, sendCommand ListAllItems)
    DeleteItemFail error ->
      (model, sendError error)
    ItemFormMsg formCmd ->
      ({ model | budgetItemForm = Form.update formCmd model.budgetItemForm }, Cmd.none)
    SaveItem ->
      case Form.getOutput (Debug.log "form output" model.budgetItemForm) of
        -- TODO: Clear form?
        Just item ->
          (model, saveItem item)
        Nothing ->
          (model, Cmd.none)
    SaveItemDone item ->
      let update x = if x.id == item.id then item else x
          updatedCollection = List.map update model.budgetItems
      in ( { model | budgetItems = updatedCollection }, Routing.navigateTo "#/budgetItems")
    SaveItemFail error ->
      (model, sendError error)

urlUpdate : (Route, Location) -> AppModel -> (AppModel, Cmd Msg)
urlUpdate (route, location) model =
  let cmd = case route of
              -- TODO: Any better way to redirect?
              HomeRoute ->
                Routing.navigateTo "#/budgetItems"
              _ ->
                Cmd.none
  in ({ model | route = route, location = location }, cmd)
