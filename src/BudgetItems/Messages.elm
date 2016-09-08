module BudgetItems.Messages exposing (..)

import Http
import Form

import BudgetItems.Models exposing (..)

type Msg
  = FormMsg Form.Msg
  | ListAll
  | FetchAllDone (List BudgetItem)
  | FetchAllFail Http.Error
  | Create
  | CreateDone BudgetItem
  | CreateFail Http.Error
  | Save
  | SaveDone BudgetItem
  | SaveFail Http.Error
  | Edit BudgetItem
  | DeleteIntent BudgetItem
  | Delete BudgetItemId
  | DeleteDone BudgetItemId
  | DeleteFail Http.Error
