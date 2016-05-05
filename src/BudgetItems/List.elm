module BudgetItems.List (view, ViewModel) where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Signal exposing (Address)
import Number.Format as Format
import List.Extra exposing (..)

import DateHelpers exposing (..)
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
        [ iconButton "settings" [ onClick address NoOp ]
        , iconButton "add" [ onClick address Create ]
        ]
    , table []
        [ thead []
            [ tr []
                [ th [] [ text "Date" ]
                , th [] [ text "Label" ]
                , th [ class "right-align" ] [ text "Amount" ]
                , th [ class "right-align" ] [ text "Total" ]
                ]
            ]
        , tbody [] <| rows address model.budgetItems
        ]
    ]

rows : Address Action -> List BudgetItem -> List Html
rows address items =
  let maybeCurrents = List.tail <| List.scanl (\item x -> x + netAmount item) 0 items
  in case maybeCurrents of
       Just currents ->
         let itemRows = List.map (budgetItemRow address) <| zip items currents
         in itemRows ++ [ totalRow items ]
       -- Never be Nothing because `scanl f 0 []` returns `[0]`.
       Nothing ->
         []

budgetItemRow : Address Action -> (BudgetItem, Int) -> Html
budgetItemRow address (item, current) =
  let amountClass = if item.isIncome then "green-text right-align" else "red-text right-align"
      currentClass = if current >= 0 then "right-align" else "red-text right-align"
  in tr [ onClick address (Edit item) ]
       [ td [] [ text <| humanDate item.date ]
       , td [] [ text item.label ]
       , td [ class amountClass ] [ text <| Format.prettyInt ',' <| netAmount item ]
       , td [ class currentClass ] [ text <| Format.prettyInt ',' current ]
       ]

totalRow : List BudgetItem -> Html
totalRow items =
  let total = List.sum <| List.map netAmount items
  in tr [ class "budget-item-table--total" ]
       [ td [ colspan 3 ] []
       , td [] [ text <| Format.prettyInt ',' total ]
       ]

netAmount : BudgetItem -> Int
netAmount item =
  item.amount * (if item.isIncome then 1 else -1)
