module Messages exposing (..)

import Http
import Form
import Task

import Types exposing (Budget, BudgetId, BudgetItem, BudgetItemId)

type Msg
  -- Budget
  = ShowBudget BudgetId
  | FetchAllBudgetsDone (List Budget)
  | FetchAllBudgetsFail Http.Error
  -- Budget Items
  | ItemFormMsg Form.Msg
  | FetchAllItemsDone (List BudgetItem)
  | FetchAllItemsFail Http.Error
  | CreateItem
  | CreateItemDone BudgetItem
  | CreateItemFail Http.Error
  | SaveItem
  | SaveItemDone BudgetItem
  | SaveItemFail Http.Error
  | EditItem BudgetItem
  | DeleteItemIntent BudgetItem
  | DeleteItem BudgetItemId
  | DeleteItemDone BudgetItemId
  | DeleteItemFail Http.Error

-- Util
sendCommand : a -> Cmd a
sendCommand a =
  let const _ = a
  in Task.perform const const <| Task.succeed ()
