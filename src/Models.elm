module Models exposing (..)

import Budgets.Models exposing (..)
import BudgetItems.Models exposing (..)
import Routing exposing (Route)
import Hop.Types exposing (Location)

type alias AppModel =
  { budgets : Budgets.Models.Model
  , budgetItems : BudgetItems.Models.Model
  , routing : Routing.Model
  , errorMessage : Maybe String
  }

initialModel : (Route, Location) -> AppModel
initialModel rl =
  { budgets = Budgets.Models.initialModel
  , budgetItems = BudgetItems.Models.initialModel
  , routing = Routing.initialModel rl
  , errorMessage = Nothing
  }
