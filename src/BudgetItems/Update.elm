module BudgetItems.Update (..) where

import Signal exposing (Address)
import Effects exposing (Effects)
import Task
import Http
import Form exposing (Form)

import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)
import BudgetItems.Effects exposing (..)

type alias Context =
  { showErrorAddress : Address String
  , navigateAddress : Address String
  , confirmationAddress : Address (BudgetItemId, String)
  }

update : Context -> Action -> Model -> (Model, Effects Action)
update ctx action model =
  case action of
    NoOp ->
      (model, Effects.none)
    ListAll ->
      (model, makeSendFx ctx.navigateAddress "#/budgetItems")
    FetchAllDone result ->
      case result of
        Ok fetchedItems ->
          ({ model | items = fetchedItems }, Effects.none)
        Err error ->
          sendError ctx model error
    Create ->
      (model, create new)
    CreateDone result ->
      case result of
        Ok item ->
          let updatedCollection = item :: model.items
              fx = Task.succeed (Edit item) |> Effects.task
          in ({ model | items = updatedCollection }, fx)
        Err error ->
          sendError ctx model error
    Edit item ->
      let path = "#/budgetItems/" ++ (toString item.id) ++ "/edit"
          -- TODO: Do this in routing so that this works with only URL change.
          updatedModel = { model | form = makeForm item }
      in (updatedModel, makeSendFx ctx.navigateAddress path)
    DeleteIntent item ->
      let message = "Are you sure you want to delete " ++ item.label ++ "?"
          fx = makeSendFx ctx.confirmationAddress (item.id, message)
      in (model, fx)
    Delete id ->
      (model, delete id)
    DeleteDone id result ->
      case result of
        Ok () ->
          let updatedCollection =
                List.filter (\x -> x.id /= id) model.items
              fx = Task.succeed ListAll |> Effects.task
          in ({ model | items = updatedCollection }, fx)
        Err error ->
          sendError ctx model error
    FormAction formAction ->
      ({ model | form = Form.update formAction model.form }, Effects.none)
    Save ->
      case Form.getOutput (Debug.log "form output" model.form) of
        -- TODO: Clear form?
        Just item ->
          (model, save item)
        Nothing ->
          (model, Effects.none)
    SaveDone result ->
      case result of
        Ok item ->
          let update x = if x.id == item.id then item else x
              updatedCollection = List.map update model.items
          in ( { model | items = updatedCollection }
             , makeSendFx ctx.navigateAddress "#/budgetItems")
        Err error ->
          sendError ctx model error
    TaskDone () ->
      (model, Effects.none)

sendError : Context -> Model -> Http.Error -> (Model, Effects Action)
sendError ctx model error =
  let message = toString error
      fx = makeSendFx ctx.showErrorAddress message
  in (model, fx)

makeSendFx : Address a -> a -> Effects Action
makeSendFx address x =
  Signal.send address x
    |> Effects.task
    |> Effects.map TaskDone
