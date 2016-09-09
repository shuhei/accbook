module Budgets.List exposing (..)

import Html exposing (..)
import Html.Events exposing (..)

import Messages exposing (Msg (ShowBudget))
import Types exposing (Budget)
import Materialize exposing (..)

view : List Budget -> List (Html Msg)
view budgets =
  let row budget =
        listItem budget.name
          [ onClick <| ShowBudget budget.id ]
  in List.map row budgets
