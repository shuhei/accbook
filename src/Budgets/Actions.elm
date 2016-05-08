module Budgets.Actions (..) where

import Http
import Form

import Budgets.Models exposing (..)

type Action
  = NoOp
  | FormAction Form.Action
  | Show BudgetId
  | ListAll
  | FetchAllDone (Result Http.Error (List Budget))
  | Create
  | CreateDone (Result Http.Error Budget)
  | Save
  | SaveDone (Result Http.Error Budget)
  | Edit Budget
  | DeleteIntent Budget
  | Delete Budget
  | DeleteDone BudgetId (Result Http.Error ())
  | TaskDone ()
