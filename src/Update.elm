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
      let (updatedRouting, fx) = Routing.update act model.routing
      in ({ model | routing = updatedRouting }, Effects.map RoutingAction fx)
    BudgetItemsAction act ->
      let makeAddress = Signal.forwardTo actionsMailbox.address
          updateModel = { budgetItems = model.budgetItems
                        , showErrorAddress = makeAddress ShowError
                        , navigateAddress = makeAddress <| RoutingAction << Routing.NavigateTo
                        }
          (updatedItems, fx) = BudgetItems.Update.update act updateModel
      in ({ model | budgetItems = updatedItems }, Effects.map BudgetItemsAction fx)
    -- Add label amount ->
      -- noEffects
        -- { model |
          -- uid = model.uid + 1
        -- , budgetItems = model.budgetItems ++ [ BudgetItem model.uid label amount (Date.fromTime 1462172198819) ]
        -- }
    -- Delete id ->
      -- noEffects
        -- { model |
          -- budgetItems = List.filter (\i -> i.id /= id) model.budgetItems
        -- }
    -- BudgetItemFormAction act ->
      -- let formModel = BudgetItemForm.update act model.budgetItemForm
      -- in case act of
        -- BudgetItemForm.Cancel ->
          -- noEffects { model | route = ShowHome, budgetItemForm = formModel }
        -- _ ->
          -- noEffects { model | budgetItemForm = formModel }
    -- RouteAction route ->
      -- noEffects { model | route = route }
    ShowError message ->
      ({ model | errorMessage = Just message }, Effects.none)
    _ ->
      (model, Effects.none)
