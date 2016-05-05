module BudgetItems.Update (..) where

import Signal exposing (Address)
import Effects exposing (Effects)
import Task
import Http
import Form exposing (Form)

import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)
import BudgetItems.Effects exposing (..)

-- FIXME: Unintuitive name: budgetItems.
type alias UpdateModel =
  { budgetItems : Model
  , showErrorAddress : Address String
  , navigateAddress : Address String
  , confirmationAddress : Address (BudgetItemId, String)
  }

update : Action -> UpdateModel -> (Model, Effects Action)
update action ({budgetItems} as model) =
  case action of
    NoOp ->
      (budgetItems, Effects.none)
    ListAll ->
      (model.budgetItems, makeSendFx model.navigateAddress "#/budgetItems")
    FetchAllDone result ->
      case result of
        Ok fetchedItems ->
          ({ budgetItems | items = fetchedItems }, Effects.none)
        Err error ->
          sendError model error
    Create ->
      (model.budgetItems, create new)
    CreateDone result ->
      case result of
        Ok item ->
          let updatedCollection = item :: budgetItems.items
              fx = Task.succeed (Edit item) |> Effects.task
          in ({ budgetItems | items = updatedCollection }, fx)
        Err error ->
          sendError model error
    Edit item ->
      let path = "#/budgetItems/" ++ (toString item.id) ++ "/edit"
          -- TODO: Do this in routing so that this works with only URL change.
          updatedModel = { budgetItems | form = makeForm item }
      in (updatedModel, makeSendFx model.navigateAddress path)
    DeleteIntent item ->
      let message = "Are you sure you want to delete " ++ item.label ++ "?"
          fx = makeSendFx model.confirmationAddress (item.id, message)
      in (model.budgetItems, fx)
    Delete id ->
      (model.budgetItems, delete id)
    DeleteDone id result ->
      case result of
        Ok () ->
          let updatedCollection =
                List.filter (\x -> x.id /= id) budgetItems.items
              fx = Task.succeed ListAll |> Effects.task
          in ({ budgetItems | items = updatedCollection }, fx)
        Err error ->
          sendError model error
    FormAction formAction ->
      ({ budgetItems | form = Form.update formAction budgetItems.form }, Effects.none)
    Save ->
      case Form.getOutput (Debug.log "form output" budgetItems.form) of
        -- TODO: Clear form?
        Just item ->
          (model.budgetItems, save item)
        Nothing ->
          (model.budgetItems, Effects.none)
    SaveDone result ->
      case result of
        Ok item ->
          let update x = if x.id == item.id then item else x
              updatedCollection = List.map update budgetItems.items
          in ( { budgetItems | items = updatedCollection }
             , makeSendFx model.navigateAddress "#/budgetItems")
        Err error ->
          sendError model error
    TaskDone () ->
      (model.budgetItems, Effects.none)

sendError : UpdateModel -> Http.Error -> (Model, Effects Action)
sendError model error =
  let message = toString error
      fx = makeSendFx model.showErrorAddress message
  in (model.budgetItems, fx)

makeSendFx : Address a -> a -> Effects Action
makeSendFx address x =
  Signal.send address x
    |> Effects.task
    |> Effects.map TaskDone
