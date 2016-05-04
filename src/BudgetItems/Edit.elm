module BudgetItems.Edit (..) where

import Html exposing (..)
import Html.Attributes exposing (..)
import Signal exposing (Address)
import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)

import Materialize exposing (..)

type alias ViewModel =
  { budgetItem : BudgetItem
  }

type alias View =
  Address Action -> ViewModel -> Html

view : Address Action -> ViewModel -> Html
view address model =
  div
    []
    [ form' address model ]

form' : Address Action -> ViewModel -> Html
form' address model =
  div []
    [ h1 [] [ text "Edit budget item" ]
    , div []
        [ textButton "cancel" [ href "#/budgetItems" ] ]
    ]
