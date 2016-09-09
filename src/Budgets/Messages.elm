module Budgets.Messages exposing (..)

import Http
-- import Form

import Budgets.Models exposing (..)

type Msg
  = ShowBudget BudgetId
  | FetchAllBudgetsDone (List Budget)
  | FetchAllBudgetsFail Http.Error
