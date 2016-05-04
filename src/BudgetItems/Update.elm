module BudgetItems.Update (..) where

import Effects exposing (Effects)

import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)

type alias UpdateModel =
  { budgetItems : List BudgetItem
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
          (model.budgetItems, Effects.none)
