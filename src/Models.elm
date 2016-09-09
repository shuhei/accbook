module Models exposing (..)

import Date exposing (Date)
import Form exposing (Form)
import Form.Validate as Validate exposing (..)
import Form.Field as Field exposing (..)

import Hop.Types exposing (Location)
import DateHelpers exposing (..)

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
  , budgetItemForm = Form.initial [] validate
  , route = route
  , location = location
  , errorMessage = Nothing
  }

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

new : BudgetItem
new =
  { id = 0
  , label = ""
  , isIncome = False
  , amount = 0
  , date = Date.fromTime 0
  }

-- Budget Item Form

validate : Validation () BudgetItem
validate =
  form5 BudgetItem
    (get "id" int)
    (get "label" string)
    (get "isIncome" bool)
    (get "amount" int)
    (get "date" date)

makeForm : BudgetItem -> Form () BudgetItem
makeForm item =
  let fields =
        [ ("id", Text (toString item.id))
        , ("label", Text item.label)
        , ("isIncome", Check item.isIncome)
        , ("amount", Text (toString item.amount))
        , ("date", Text (formatIsoDate item.date))
        ]
  in Form.initial fields validate
