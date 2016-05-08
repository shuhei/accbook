module Models (..) where

import Budgets.Models exposing (..)
import BudgetItems.Models exposing (..)
import Routing

type alias AppModel =
  { budgets : Budgets.Models.Model
  , budgetItems : BudgetItems.Models.Model
  , routing : Routing.Model
  , errorMessage : Maybe String
  }

initialModel : AppModel
initialModel =
  { budgets = Budgets.Models.initialModel
  , budgetItems = BudgetItems.Models.initialModel
  , routing = Routing.initialModel
  , errorMessage = Nothing
  }
