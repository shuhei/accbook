module BudgetItems.List exposing (view, ViewModel)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Numeral
import List.Extra exposing (zip)

import DateHelper exposing (..)
import Messages exposing (..)
import Types exposing (Budget, BudgetId, BudgetItem)
import Materialize exposing (..)

type alias ViewModel =
  { budgetItems : List BudgetItem
  , budget : Budget
  }

view : ViewModel -> Html Msg
view model =
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
        , tbody [] <| rows model.budgetItems
        ]
    , div [ class "fixed-action-btn" ]
        [ floatingActionButton "add"
            [ onClick <| CreateItem model.budget.id ]
        ]
    ]

rows : List BudgetItem -> List (Html Msg)
rows items =
  let maybeBalances = List.tail <| List.scanl (\item x -> x + netAmount item) 0 items
  in case maybeBalances of
       Just balances ->
         let itemRows = List.map budgetItemRow <| zip items balances
         in itemRows ++ [ totalRow items ]
       -- Never be Nothing because `scanl f 0 []` returns `[0]`.
       Nothing ->
         []

budgetItemRow : (BudgetItem, Int) -> Html Msg
budgetItemRow (item, balance) =
  let amountClass = if item.isIncome then "green-text right-align" else "red-text right-align"
      balanceClass = if balance >= 0 then "right-align" else "red-text right-align"
  in tr [ class "budget-item-table--item-row", onClick <| EditItem item ]
       [ td [] [ text <| humanDate item.date ]
       , td [] [ text item.label ]
       , td [ class amountClass ] [ text <| prettyInt <| netAmount item ]
       , td [ class balanceClass ] [ text <| prettyInt balance ]
       ]

totalRow : List BudgetItem -> Html Msg
totalRow items =
  let total = List.sum <| List.map netAmount items
  in tr [ class "budget-item-table--total-row" ]
       [ th [] [ text "Total" ]
       , td [ colspan 2 ] []
       , td [ class "right-align" ] [ text <| prettyInt total ]
       ]

netAmount : BudgetItem -> Int
netAmount item =
  item.amount * (if item.isIncome then 1 else -1)

prettyInt : Int -> String
prettyInt n =
  Numeral.format "0,0" <| toFloat n
