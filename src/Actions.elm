module Actions (..) where

import BudgetItems.Actions
import Routing

type Action
  = NoOp
  | RoutingAction Routing.Action
  | BudgetItemsAction BudgetItems.Actions.Action
