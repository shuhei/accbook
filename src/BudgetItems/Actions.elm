module BudgetItems.Actions (..) where

import Http
import BudgetItems.Models exposing (..)

type Action
  = NoOp
  | ListAll
  | FetchAllDone (Result Http.Error (List BudgetItem))
  | Create
  | CreateDone (Result Http.Error BudgetItem)
  | Edit BudgetItemId
  | DeleteIntent BudgetItem
  | Delete BudgetItemId
  | DeleteDone BudgetItemId (Result Http.Error ())
  | TaskDone ()
