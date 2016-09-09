module Models exposing (..)

import Date exposing (Date)
import Form exposing (Form)
import Hop.Types exposing (Location)

import Types exposing (..)
import BudgetItems.Form exposing (validateItemForm)

type alias AppModel =
  { budgets : List Budget
  , budgetItems : List BudgetItem
  , budgetItemForm : Form () BudgetItem
  , route : Route
  , location : Location
  , errorMessage : Maybe String
  }

initialModel : (Route, Location) -> AppModel
initialModel (route, location) =
  { budgets = []
  , budgetItems = []
  , budgetItemForm = Form.initial [] validateItemForm
  , route = route
  , location = location
  , errorMessage = Nothing
  }

newItem : BudgetItem
newItem =
  { id = 0
  , label = ""
  , isIncome = False
  , amount = 0
  , date = Date.fromTime 0
  }
