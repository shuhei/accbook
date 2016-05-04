module BudgetItems.Actions (..) where

import Http
import BudgetItems.Models exposing (..)

type Action
  = NoOp
  | Delete BudgetItemId
  | FetchAllDone (Result Http.Error (List BudgetItem))
  | Create
  | CreateDone (Result Http.Error BudgetItem)
  | Edit BudgetItemId
  | TaskDone ()
