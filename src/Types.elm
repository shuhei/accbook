module Types exposing (..)

import Date

-- Routing

type Route
  = HomeRoute
  | BudgetRoute BudgetId
  | BudgetItemEditRoute BudgetItemId
  | NotFoundRoute

-- Budget

type alias BudgetId =
  Int

type alias Budget =
  { id : BudgetId
  , name : String
  }

-- Budget Item

type alias BudgetItemId =
  Int

-- TODO: Use Maybe for id and budgetId?
type alias BudgetItem =
  { id : BudgetItemId
  , budgetId : BudgetId
  , label : String
  , isIncome : Bool
  , amount : Int
  , date : Date.Date
  }

newItem : BudgetItem
newItem =
  { id = 0
  , budgetId = 0
  , label = ""
  , isIncome = False
  , amount = 0
  , date = Date.fromTime 0
  }
