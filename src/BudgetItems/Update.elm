module BudgetItems.Update exposing (..)

import Form exposing (Form)

import Common exposing (..)
import BudgetItems.Messages exposing (..)
import BudgetItems.Models exposing (..)
import BudgetItems.Commands exposing (..)

update : Msg -> Model -> (Model, Cmd Msg, Cmd OutMsg)
update action model =
  case action of
    ListAllItems ->
      (model, Cmd.none, navigateTo "#/budgetItems")
    FetchAllItemsDone fetchedItems ->
      ({ model | items = fetchedItems }, Cmd.none, Cmd.none)
    FetchAllItemsFail error ->
      (model, Cmd.none, sendError error)
    CreateItem ->
      (model, create new, Cmd.none)
    CreateItemDone item ->
      let updatedModel = { model | items = item :: model.items }
      in (updatedModel, sendCommand <| EditItem item, Cmd.none)
    CreateItemFail error ->
      (model, Cmd.none, sendError error)
    EditItem item ->
      let path = "#/budgetItems/" ++ (toString item.id) ++ "/edit"
          -- TODO: Do this in routing so that this works with only URL change.
          updatedModel = { model | form = makeForm item }
      in (updatedModel, Cmd.none, navigateTo path)
    DeleteItemIntent item ->
      let message = "Are you sure you want to delete " ++ item.label ++ "?"
      in (model, Cmd.none, confirm item.id message)
    DeleteItem id ->
      (model, delete id, Cmd.none)
    DeleteItemDone id ->
      let updatedModel =
        { model | items = List.filter (\x -> x.id /= id) model.items }
      in (updatedModel, sendCommand ListAllItems, Cmd.none)
    DeleteItemFail error ->
      (model, Cmd.none, sendError error)
    ItemFormMsg formAction ->
      ({ model | form = Form.update formAction model.form }, Cmd.none, Cmd.none)
    SaveItem ->
      case Form.getOutput (Debug.log "form output" model.form) of
        -- TODO: Clear form?
        Just item ->
          (model, save item, Cmd.none)
        Nothing ->
          (model, Cmd.none, Cmd.none)
    SaveItemDone item ->
      let update x = if x.id == item.id then item else x
          updatedCollection = List.map update model.items
      in ( { model | items = updatedCollection }, Cmd.none, navigateTo "#/budgetItems")
    SaveItemFail error ->
      (model, Cmd.none, sendError error)
