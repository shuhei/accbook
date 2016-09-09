module BudgetItems.Messages exposing (..)

import Http
import Form

import BudgetItems.Models exposing (..)

type Msg
  = ItemFormMsg Form.Msg
  | ListAllItems
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
