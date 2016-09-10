module BudgetItems.Form exposing (..)

import Form exposing (Form)
import Form.Validate as Validate exposing (..)
import Form.Field as Field exposing (..)
import Types exposing (..)

import DateHelper exposing (..)

validateItemForm : Validation () BudgetItem
validateItemForm =
  form6 BudgetItem
    (get "id" int)
    (get "budgetId" int)
    (get "label" string)
    (get "isIncome" bool)
    (get "amount" int)
    (get "date" date)

makeItemForm : BudgetItem -> Form () BudgetItem
makeItemForm item =
  let fields =
        [ ("id", Text (toString item.id))
        , ("budgetId", Text (toString item.budgetId))
        , ("label", Text item.label)
        , ("isIncome", Check item.isIncome)
        , ("amount", Text (toString item.amount))
        , ("date", Text (formatIsoDate item.date))
        ]
  in Form.initial fields validateItemForm
