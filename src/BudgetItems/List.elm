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
    [ table []
        [ thead []
            [ tr []
                [ th [] [ text "Date" ]
                , th [] [ text "Label" ]
                , th [ class "right-align" ] [ text "Amount" ]
                , th [ class "right-align" ] [ text "Balance" ]
                ]
            ]
        , tbody [] <| rows address model.budgetItems
        ]
    , div [ class "fixed-action-btn" ]
        [ floatingActionButton "add" [ onClick address Create ]
        ]
    ]

rows : Address Action -> List BudgetItem -> List Html
rows address items =
  let maybeBalances = List.tail <| List.scanl (\item x -> x + netAmount item) 0 items
  in case maybeBalances of
       Just balances ->
         let itemRows = List.map (budgetItemRow address) <| zip items balances
         in itemRows ++ [ totalRow items ]
       -- Never be Nothing because `scanl f 0 []` returns `[0]`.
       Nothing ->
         []

budgetItemRow : Address Action -> (BudgetItem, Int) -> Html
budgetItemRow address (item, balance) =
  let amountClass = if item.isIncome then "green-text right-align" else "red-text right-align"
      balanceClass = if balance >= 0 then "right-align" else "red-text right-align"
  in tr [ class "budget-item-table--item-row", onClick address (Edit item) ]
       [ td [] [ text <| humanDate item.date ]
       , td [] [ text item.label ]
       , td [ class amountClass ] [ text <| Format.prettyInt ',' <| netAmount item ]
       , td [ class balanceClass ] [ text <| Format.prettyInt ',' balance ]
       ]

totalRow : List BudgetItem -> Html
totalRow items =
  let total = List.sum <| List.map netAmount items
  in tr [ class "budget-item-table--total-row" ]
       [ th [] [ text "Total" ]
       , td [ colspan 2 ] []
       , td [ class "right-align" ] [ text <| Format.prettyInt ',' total ]
       ]

netAmount : BudgetItem -> Int
netAmount item =
  item.amount * (if item.isIncome then 1 else -1)
