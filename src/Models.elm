module Models (..) where

import BudgetItems.Models exposing (..)
import Routing

type alias AppModel =
  { budgetItems : List BudgetItem
  , routing : Routing.Model
  }

initialModel : AppModel
initialModel =
  { budgetItems = []
  , routing = Routing.initialModel
  }
