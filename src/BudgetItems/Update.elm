module BudgetItems.Update (..) where

import Signal exposing (Address)
import Effects exposing (Effects)
import Task
import Http

import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)
import BudgetItems.Effects exposing (..)

type alias UpdateModel =
  { budgetItems : List BudgetItem
  , showErrorAddress : Address String
  , navigateAddress : Address String
  }

update : Action -> UpdateModel -> (List BudgetItem, Effects Action)
update action model =
  case action of
    NoOp ->
      (model.budgetItems, Effects.none)
    Delete id ->
      (List.filter (\x -> x.id /= id) model.budgetItems, Effects.none)
    FetchAllDone result ->
      case result of
        Ok budgetItems ->
          (budgetItems, Effects.none)
        Err error ->
          sendError model error
    Create ->
      (model.budgetItems, create new)
    CreateDone result ->
      case result of
        Ok item ->
          let updatedCollection = item :: model.budgetItems
              fx = Task.succeed (Edit item.id) |> Effects.task
          in (updatedCollection, fx)
        Err error ->
          sendError model error
    Edit id ->
      let path = "#/budgetItems/" ++ (toString id) ++ "/edit"
          fx = makeSendFx model.navigateAddress path
      in (model.budgetItems, fx)
    TaskDone () ->
      (model.budgetItems, Effects.none)

sendError : UpdateModel -> Http.Error -> (List BudgetItem, Effects Action)
sendError model error =
  let message = toString error
      fx = makeSendFx model.showErrorAddress message
  in (model.budgetItems, fx)

makeSendFx : Address String -> String -> Effects Action
makeSendFx address str =
  Signal.send address str
    |> Effects.task
    |> Effects.map TaskDone
