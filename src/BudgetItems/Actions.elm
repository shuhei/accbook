module BudgetItems.Actions (..) where

import Http
import BudgetItems.Models exposing (..)

type Action
  = NoOp
  | Delete BudgetItemId
  | FetchAllDone (Result Http.Error (List BudgetItem))
  | TaskDone ()
