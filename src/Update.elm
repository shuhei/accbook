module Update (..) where

import Effects exposing (Effects)

import Actions exposing (..)
import Models exposing (..)
import Mailboxes exposing (..)
import Routing
import BudgetItems.Update
import Debug

update : Action -> AppModel -> (AppModel, Effects Action)
update action model =
  case (Debug.log "action" action) of
    RoutingAction act ->
      let context = { navigateAddress = Signal.forwardTo actionsMailbox.address <| RoutingAction << Routing.NavigateTo }
          (updatedRouting, fx) = Routing.update context act model.routing
      in ({ model | routing = updatedRouting }, Effects.map RoutingAction fx)
    BudgetItemsAction act ->
      let makeAddress = Signal.forwardTo actionsMailbox.address
          context = { showErrorAddress = Signal.forwardTo actionsMailbox.address ShowError
                    , navigateAddress = Signal.forwardTo actionsMailbox.address <| RoutingAction << Routing.NavigateTo
                    , confirmationAddress = confirmationMailbox.address
                    }
          (updatedModel, fx) = BudgetItems.Update.update context act model.budgetItems
      in ({ model | budgetItems = updatedModel }, Effects.map BudgetItemsAction fx)
    ShowError message ->
      ({ model | errorMessage = Just message }, Effects.none)
    _ ->
      (model, Effects.none)
