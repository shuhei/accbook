module Budgets.List exposing (..)

import Html exposing (..)
import Html.Events exposing (..)

import Budgets.Messages exposing (..)
import Budgets.Models exposing (..)
import Materialize exposing (..)

view : Model -> List (Html Msg)
view model =
  let row budget =
        listItem budget.name
          [ onClick <| ShowBudget budget.id ]
  in List.map row model.budgets
