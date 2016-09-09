module Update exposing (update, urlUpdate)

import Debug
import Hop.Types exposing (Location)

import Messages exposing (..)
import Models exposing (..)
import Ports exposing (..)
import Routing
import BudgetItems.Commands exposing (..)
import Form exposing (Form)

update : Msg -> AppModel -> (AppModel, Cmd Msg)
update action model =
  case (Debug.log "action" action) of
    ShowError error ->
      ({ model | errorMessage = Just error }, Cmd.none)
    NavigateTo url ->
      (model, Routing.navigateTo url)
    Confirm (id, message) ->
      (model, askConfirmation (id, message))
    -- Budgets
    ShowBudget id ->
      let path = "#/budgets/" ++ (toString id)
      in (model, navigateTo path)
    FetchAllBudgetsDone budgets ->
      ({ model | budgets = budgets }, Cmd.none)
    FetchAllBudgetsFail error ->
      (model, sendError error)
    -- Budget Items
    ListAllItems ->
      (model, navigateTo "#/budgetItems")
    FetchAllItemsDone fetchedItems ->
      ({ model | budgetItems = fetchedItems }, Cmd.none)
    FetchAllItemsFail error ->
      (model, sendError error)
    CreateItem ->
      (model, create new)
    CreateItemDone item ->
      let updatedModel = { model | budgetItems = item :: model.budgetItems }
      in (updatedModel, sendCommand <| EditItem item)
    CreateItemFail error ->
      (model, sendError error)
    EditItem item ->
      let path = "#/budgetItems/" ++ (toString item.id) ++ "/edit"
          -- TODO: Do this in routing so that this works with only URL change.
          updatedModel = { model | budgetItemForm = makeForm item }
      in (updatedModel, navigateTo path)
    DeleteItemIntent item ->
      let message = "Are you sure you want to delete " ++ item.label ++ "?"
      in (model, confirm item.id message)
    DeleteItem id ->
      (model, delete id)
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
          (model, save item)
        Nothing ->
          (model, Cmd.none)
    SaveItemDone item ->
      let update x = if x.id == item.id then item else x
          updatedCollection = List.map update model.budgetItems
      in ( { model | budgetItems = updatedCollection }, navigateTo "#/budgetItems")
    SaveItemFail error ->
      (model, sendError error)

urlUpdate : (Route, Location) -> AppModel -> (AppModel, Cmd Msg)
urlUpdate (route, location) model =
  let cmd = case route of
              -- TODO: Any better way to redirect?
              HomeRoute ->
                navigateTo "#/budgetItems"
              _ ->
                Cmd.none
  in ({ model | route = route, location = location }, cmd)
