module BudgetItems.Update exposing (..)

import Form exposing (Form)

import Common exposing (..)
import BudgetItems.Messages exposing (..)
import BudgetItems.Models exposing (..)
import BudgetItems.Commands exposing (..)

update : Msg -> Model -> (Model, Cmd Msg, Cmd OutMsg)
update action model =
  case action of
    ListAll ->
      (model, Cmd.none, navigateTo "#/budgetItems")
    FetchAllDone fetchedItems ->
      ({ model | items = fetchedItems }, Cmd.none, Cmd.none)
    FetchAllFail error ->
      (model, Cmd.none, sendError error)
    Create ->
      (model, create new, Cmd.none)
    CreateDone item ->
      let updatedModel = { model | items = item :: model.items }
      in (updatedModel, sendCommand <| Edit item, Cmd.none)
    CreateFail error ->
      (model, Cmd.none, sendError error)
    Edit item ->
      let path = "#/budgetItems/" ++ (toString item.id) ++ "/edit"
          -- TODO: Do this in routing so that this works with only URL change.
          updatedModel = { model | form = makeForm item }
      in (updatedModel, Cmd.none, navigateTo path)
    DeleteIntent item ->
      let message = "Are you sure you want to delete " ++ item.label ++ "?"
      in (model, Cmd.none, confirm item.id message)
    Delete id ->
      (model, delete id, Cmd.none)
    DeleteDone id ->
      let updatedModel =
        { model | items = List.filter (\x -> x.id /= id) model.items }
      in (updatedModel, sendCommand ListAll, Cmd.none)
    DeleteFail error ->
      (model, Cmd.none, sendError error)
    FormMsg formAction ->
      ({ model | form = Form.update formAction model.form }, Cmd.none, Cmd.none)
    Save ->
      case Form.getOutput (Debug.log "form output" model.form) of
        -- TODO: Clear form?
        Just item ->
          (model, save item, Cmd.none)
        Nothing ->
          (model, Cmd.none, Cmd.none)
    SaveDone item ->
      let update x = if x.id == item.id then item else x
          updatedCollection = List.map update model.items
      in ( { model | items = updatedCollection }, Cmd.none, navigateTo "#/budgetItems")
    SaveFail error ->
      (model, Cmd.none, sendError error)
