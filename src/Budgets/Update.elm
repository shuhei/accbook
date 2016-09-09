module Budgets.Update exposing (..)

import Common exposing (..)
import Budgets.Messages exposing (..)
import Budgets.Models exposing (..)

update : Msg -> Model -> (Model, Cmd Msg, Cmd OutMsg)
update action model =
  case action of
    ShowBudget id ->
      let path = "#/budgets/" ++ (toString id)
      in (model, Cmd.none, navigateTo path)
    FetchAllBudgetsDone budgets ->
      ({ model | budgets = budgets }, Cmd.none, Cmd.none)
    FetchAllBudgetsFail error ->
      (model, Cmd.none, sendError error)
