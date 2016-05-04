module Models (..) where

import Date

import BudgetItems.Models exposing (..)
import Routing

type alias AppModel =
  { uid : Int
  , budgetItems : List BudgetItem
  , routing : Routing.Model
  }

initialModel : AppModel
initialModel =
  { uid = 0
  , budgetItems = [ BudgetItem 1 "hello" 12000 (Date.fromTime 0) ]
  , routing = Routing.initialModel
  }
