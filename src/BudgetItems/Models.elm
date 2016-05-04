module BudgetItems.Models (..) where

import Date exposing (Date)

type alias BudgetItemId =
  Int

type alias BudgetItem =
  { id : BudgetItemId
  , label : String
  , amount : Int
  , date : Date.Date
  }

new : BudgetItem
new =
  { id = 0
  , label = ""
  , amount = 0
  , date = Date.fromTime 0
  }
