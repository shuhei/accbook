module Actions (..) where

import Budgets.Actions
import BudgetItems.Actions
import Routing

type Action
  = NoOp
  | RoutingAction Routing.Action
  | BudgetsAction Budgets.Actions.Action
  | BudgetItemsAction BudgetItems.Actions.Action
  | ShowError String
