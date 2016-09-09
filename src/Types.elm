module Types exposing (..)

import Date

-- Routing

type Route
  = HomeRoute
  | BudgetItemsRoute
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

type alias BudgetItem =
  { id : BudgetItemId
  , label : String
  , isIncome : Bool
  , amount : Int
  , date : Date.Date
  }

newItem : BudgetItem
newItem =
  { id = 0
  , label = ""
  , isIncome = False
  , amount = 0
  , date = Date.fromTime 0
  }
