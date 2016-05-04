module BudgetItems.Actions (..) where

import BudgetItems.Models exposing (..)

type Action
  = NoOp
  | HopAction ()
  | Add String Int
  | Delete BudgetItemId
