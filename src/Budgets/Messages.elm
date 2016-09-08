module Budgets.Messages exposing (..)

import Http
-- import Form

import Budgets.Models exposing (..)

type Msg
  = Show BudgetId
  | FetchAllDone (List Budget)
  | FetchAllFail Http.Error
  -- | FormMsg Form.Msg
  -- | ListAll
  -- | Create
  -- | CreateDone Budget
  -- | CreateFail Http.Error
  -- | Save
  -- | SaveDone Budget
  -- | SaveFail Http.Error
  -- | Edit Budget
  -- | DeleteIntent Budget
  -- | Delete Budget
  -- | DeleteDone BudgetId
  -- | DeleteFail Http.Error
  -- | TaskDone ()
