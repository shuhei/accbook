module Models exposing (Model, initialModel)

import Form exposing (Form)
import Hop.Types exposing (Location)

import Types exposing (..)
import BudgetItems.Form exposing (validateItemForm)

type alias Model =
  { budgets : List Budget
  , budgetItems : List BudgetItem
  , budgetItemForm : Form () BudgetItem
  , route : Route
  , location : Location
  , errorMessage : Maybe String
  }

initialModel : (Route, Location) -> Model
initialModel (route, location) =
  { budgets = []
  , budgetItems = []
  , budgetItemForm = Form.initial [] validateItemForm
  , route = route
  , location = location
  , errorMessage = Nothing
  }
