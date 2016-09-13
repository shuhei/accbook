module Models exposing (..)

import Form exposing (Form)
import Hop.Types exposing (Location)

import Types exposing (Route, Budget, BudgetId, BudgetItem, BudgetItemId)
import BudgetItems.Form exposing (validateItemForm)
import ListHelper

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

-- Selectors

findBudget : BudgetId -> List Budget -> Maybe Budget
findBudget budgetId budgets =
  ListHelper.find (\x -> x.id == budgetId) budgets

selectBudgetItems : BudgetId -> List BudgetItem -> List BudgetItem
selectBudgetItems budgetId items =
  List.filter (\x -> x.budgetId == budgetId) items

findBudgetItem : BudgetItemId -> List BudgetItem -> Maybe BudgetItem
findBudgetItem id items =
  ListHelper.find (\x -> x.id == id) items
