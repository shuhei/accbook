module Update exposing (update)

import Debug
import Common
import Messages exposing (..)
import Models exposing (..)
import Ports exposing (..)
import Routing
import Budgets.Update
import BudgetItems.Update

update : Msg -> AppModel -> (AppModel, Cmd Msg)
update action model =
  case (Debug.log "action" action) of
    ShowError error ->
      ({ model | errorMessage = Just error }, Cmd.none)
    NavigateTo url ->
      (model, Routing.navigateTo url)
    Confirm (id, message) ->
      (model, askConfirmation (id, message))
    BudgetsMsg act ->
      -- TODO: Handle some addresses.
      let (updatedModel, cmd, outCmd) = Budgets.Update.update act model.budgets
          batched = Cmd.batch [ Cmd.map BudgetsMsg cmd
                              , Cmd.map handleOutMsg outCmd
                              ]
      in ({ model | budgets = updatedModel }, batched)
    BudgetItemsMsg act ->
      let (updatedModel, cmd, outCmd) = BudgetItems.Update.update act model.budgetItems
          batched = Cmd.batch [ Cmd.map BudgetItemsMsg cmd
                              , Cmd.map handleOutMsg outCmd
                              ]
      in ({ model | budgetItems = updatedModel }, batched)

handleOutMsg : Common.OutMsg -> Msg
handleOutMsg om =
  case om of
    Common.ShowError error ->
      ShowError error
    Common.NavigateTo url ->
      NavigateTo url
    Common.Confirm (id, message) ->
      Confirm (id, message)
