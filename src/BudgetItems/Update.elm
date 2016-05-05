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
  , confirmationAddress : Address (BudgetItemId, String)
  }

update : Action -> UpdateModel -> (List BudgetItem, Effects Action)
update action model =
  case action of
    NoOp ->
      (model.budgetItems, Effects.none)
    ListAll ->
      navigateTo model "#/budgetItems"
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
      navigateTo model <| "#/budgetItems/" ++ (toString id) ++ "/edit"
    DeleteIntent item ->
      let message = "Are you sure you want to delete " ++ item.label ++ "?"
          fx = makeSendFx model.confirmationAddress (item.id, message)
      in (model.budgetItems, fx)
    Delete id ->
      (model.budgetItems, delete id)
    DeleteDone id result ->
      case result of
        Ok () ->
          (List.filter (\x -> x.id /= id) model.budgetItems, Effects.none)
        Err error ->
          sendError model error
    TaskDone () ->
      (model.budgetItems, Effects.none)

sendError : UpdateModel -> Http.Error -> (List BudgetItem, Effects Action)
sendError model error =
  let message = toString error
      fx = makeSendFx model.showErrorAddress message
  in (model.budgetItems, fx)

navigateTo : UpdateModel -> String -> (List BudgetItem, Effects Action)
navigateTo model path =
  (model.budgetItems, makeSendFx model.navigateAddress path)

makeSendFx : Address a -> a -> Effects Action
makeSendFx address x =
  Signal.send address x
    |> Effects.task
    |> Effects.map TaskDone
