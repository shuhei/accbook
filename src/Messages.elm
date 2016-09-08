module Messages exposing (..)

import Budgets.Messages
import BudgetItems.Messages
import BudgetItems.Models exposing (BudgetItemId)

type Msg
  = BudgetsMsg Budgets.Messages.Msg
  | BudgetItemsMsg BudgetItems.Messages.Msg
  | ShowError String
  | Confirm (BudgetItemId, String)
  | NavigateTo String
