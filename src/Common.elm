module Common exposing (..)

import Http
import Task

import BudgetItems.Models exposing (BudgetItemId)

type OutMsg
  = ShowError String
  | NavigateTo String
  | Confirm (BudgetItemId, String)

sendError : Http.Error -> Cmd OutMsg
sendError error =
  sendCommand <| ShowError (toString error)

confirm : BudgetItemId -> String -> Cmd OutMsg
confirm id message =
  sendCommand <| Confirm (id, message)

navigateTo : String -> Cmd OutMsg
navigateTo url =
  sendCommand <| NavigateTo url

-- Util
sendCommand : a -> Cmd a
sendCommand a =
  let const _ = a
  in Task.perform const const <| Task.succeed ()
