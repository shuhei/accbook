module BudgetItems.Actions (..) where

import Http
import Form

import BudgetItems.Models exposing (..)

type Action
  = NoOp
  | FormAction Form.Action
  | ListAll
  | FetchAllDone (Result Http.Error (List BudgetItem))
  | Create
  | CreateDone (Result Http.Error BudgetItem)
  | Save
  | SaveDone (Result Http.Error BudgetItem)
  | Edit BudgetItem
  | DeleteIntent BudgetItem
  | Delete BudgetItemId
  | DeleteDone BudgetItemId (Result Http.Error ())
  | TaskDone ()
