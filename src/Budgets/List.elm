module Budgets.List (..) where

import Signal exposing (Address)
import Html exposing (..)
import Html.Events exposing (..)

import Budgets.Actions exposing (..)
import Budgets.Models exposing (..)
import Materialize exposing (..)

view : Address Action -> Model -> List Html
view address model =
  let row budget =
        listItem budget.name
          [ onClick address <| Show budget.id ]
  in List.map row model.budgets
