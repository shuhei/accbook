module BudgetItems.Models exposing (..)

import Date exposing (Date)
import Form exposing (Form)
import Form.Validate as Validate exposing (..)
import Form.Field as Field exposing (..)
import DateHelpers exposing (..)

type alias Model =
  { items : List BudgetItem
  , form : Form () BudgetItem
  }

type alias BudgetItemId =
  Int

type alias BudgetItem =
  { id : BudgetItemId
  , label : String
  , isIncome : Bool
  , amount : Int
  , date : Date.Date
  }

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

initialModel : Model
initialModel =
  { items = []
  , form = Form.initial [] validate
  }

new : BudgetItem
new =
  { id = 0
  , label = ""
  , isIncome = False
  , amount = 0
  , date = Date.fromTime 0
  }
