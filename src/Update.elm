module Update exposing (update, urlUpdate)

import Debug
import Hop.Types exposing (Location)
import Http

import Types exposing (..)
import Messages exposing (..)
import Models exposing (..)
import Ports exposing (..)
import Routing
import BudgetItems.Commands exposing (createItem, saveItem, deleteItem)
import BudgetItems.Form exposing (..)
import Form exposing (Form)

update : Msg -> Model -> (Model, Cmd Msg)
update action model =
  case (Debug.log "action" action) of
    -- Budgets
    ShowBudget id ->
      (model, Routing.navigateTo <| "#/budgets/" ++ (toString id))
    FetchAllBudgetsDone budgets ->
      ({ model | budgets = budgets }, Cmd.none)
    FetchAllBudgetsFail error ->
      showError error model
    -- Budget Items
    FetchAllItemsDone fetchedItems ->
      ({ model | budgetItems = fetchedItems }, Cmd.none)
    FetchAllItemsFail error ->
      showError error model
    CreateItem ->
      (model, createItem newItem)
    CreateItemDone item ->
      let updatedModel = { model | budgetItems = item :: model.budgetItems }
      in (updatedModel, sendCommand <| EditItem item)
    CreateItemFail error ->
      showError error model
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
          (model, saveItem item)
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
  let cmd = case route of
              -- TODO: Any better way to redirect?
              HomeRoute ->
                Routing.navigateTo "#/budgetItems"
              _ ->
                Cmd.none
  in ({ model | route = route, location = location }, cmd)

-- Show error message.
showError : Http.Error -> Model -> (Model, Cmd Msg)
showError error model =
  ({ model | errorMessage = Just (toString error) }, Cmd.none)
