module BudgetItems.List (view, ViewModel) where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Signal exposing (Address)

import Helpers exposing (..)
import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (BudgetItem)
import Materialize exposing (..)

type alias ViewModel =
  { budgetItems : List BudgetItem
  }

view : Address Action -> ViewModel -> Html
view address model =
  div []
    [ h1 [] [ text "accbook" ]
    , div
        []
        [ iconButton "settings" [ onClick address <| NoOp ]
        -- , iconButton "add" [ onClick address <| RouteAction NewBudgetItem ]
        ]
    , table []
        [ thead []
            [ tr []
                [ th [] [ text "Date" ]
                , th [] [ text "Label" ]
                , th [] [ text "Amount" ]
                , th [] []
                ]
            ]
        , tbody [] <| List.map (budgetItemRow address) model.budgetItems
        ]
    ]

budgetItemRow : Address Action -> BudgetItem -> Html
budgetItemRow address item =
  tr []
    [ td [] [ text (formatDate item.date) ]
    , td [] [ text item.label ]
    , td [] [ text (toString item.amount) ]
    , td []
        [ iconButton "edit" [ href <| "#/budgetItems/" ++ (toString item.id) ++ "/edit" ]
        , iconButton "delete" [ onClick address (Delete item.id) ]
        ]
    ]
