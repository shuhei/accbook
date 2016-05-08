module Budgets.Models (..) where

type alias BudgetId =
  Int

type alias Budget =
  { id : BudgetId
  , name : String
  }

type alias Model =
  { budgets : List Budget
  }

initialModel : Model
initialModel =
  { budgets = []
  }
