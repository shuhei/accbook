module Update (..) where

import Effects exposing (Effects)

import Actions exposing (..)
import Models exposing (..)
import Mailboxes exposing (..)
import Routing
import Budgets.Update
import BudgetItems.Update
import Debug

update : Action -> AppModel -> (AppModel, Effects Action)
update action model =
  let makeAddress = Signal.forwardTo actionsMailbox.address
  in
    case (Debug.log "action" action) of
      RoutingAction act ->
        let context = { navigateAddress = Signal.forwardTo actionsMailbox.address <| RoutingAction << Routing.NavigateTo }
            (updatedRouting, fx) = Routing.update context act model.routing
        in ({ model | routing = updatedRouting }, Effects.map RoutingAction fx)
      BudgetsAction act ->
        let (updatedModel, fx) = Budgets.Update.update act model.budgets
        in ({ model | budgets = updatedModel }, Effects.map BudgetsAction fx)
      BudgetItemsAction act ->
        let context = { showErrorAddress = Signal.forwardTo actionsMailbox.address ShowError
                      , navigateAddress = Signal.forwardTo actionsMailbox.address <| RoutingAction << Routing.NavigateTo
                      , confirmationAddress = confirmationMailbox.address
                      }
            (updatedModel, fx) = BudgetItems.Update.update context act model.budgetItems
        in ({ model | budgetItems = updatedModel }, Effects.map BudgetItemsAction fx)
      ShowError message ->
        ({ model | errorMessage = Just message }, Effects.none)
      _ ->
        (model, Effects.none)
