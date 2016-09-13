module Budgets.List exposing (..)

import Html exposing (..)
import Html.Events exposing (..)

import Messages exposing (Msg (ShowBudget))
import Types exposing (Budget, BudgetId)
import Materialize exposing (..)

view : Maybe BudgetId -> List Budget -> List (Html Msg)
view selectedBudgetId budgets =
  List.map (row selectedBudgetId) budgets

row : Maybe BudgetId -> Budget -> Html Msg
row selectedBudgetId budget =
  let active =
        case selectedBudgetId of
          Just id ->
            budget.id == id
          Nothing ->
            False
  in listItem budget.name active
       [ onClick <| ShowBudget budget.id ]
