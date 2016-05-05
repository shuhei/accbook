module Models (..) where

import BudgetItems.Models exposing (..)
import Routing

type alias AppModel =
  { budgetItems : BudgetItems.Models.Model
  , routing : Routing.Model
  , errorMessage : Maybe String
  }

initialModel : AppModel
initialModel =
  { budgetItems = BudgetItems.Models.initialModel
  , routing = Routing.initialModel
  , errorMessage = Nothing
  }
