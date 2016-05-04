module BudgetItems.Actions (..) where

import Http
import BudgetItems.Models exposing (..)

type Action
  = NoOp
  -- | Add String Int
  | Delete BudgetItemId
  | FetchAllDone (Result Http.Error (List BudgetItem))
