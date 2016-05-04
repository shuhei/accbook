module BudgetItems.Update (..) where

import Effects exposing (Effects)

import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)

type alias UpdateModel =
  { budgetItems : List BudgetItem
  , showErrorAddress : Signal.Address String
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
          let errorMessage = toString error
              fx = Signal.send model.showErrorAddress errorMessage
                |> Effects.task
                |> Effects.map TaskDone
          in (model.budgetItems, fx)
    TaskDone () ->
      (model.budgetItems, Effects.none)
