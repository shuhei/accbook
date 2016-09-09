module Main exposing (..)

import Navigation
import Hop.Types exposing (Location)

import Messages exposing (..)
import Models exposing (..)
import Update exposing (update)
import View exposing (view)
import Routing exposing (Route)
import Budgets.Commands
import BudgetItems.Commands
import BudgetItems.Messages
import Ports exposing (..)

init : (Route, Location) -> (AppModel, Cmd Msg)
init rl =
  let cmds = [ Cmd.map BudgetsMsg Budgets.Commands.fetchAll
             , Cmd.map BudgetItemsMsg BudgetItems.Commands.fetchAll
             ]
      cmd = Cmd.batch cmds
  in (initialModel rl, cmd)

-- TODO: Generalize.
subscriptions : AppModel -> Sub Msg
subscriptions model =
  getConfirmation <| BudgetItemsMsg << BudgetItems.Messages.DeleteItem

urlUpdate : (Route, Location) -> AppModel -> (AppModel, Cmd msg)
urlUpdate rl model =
  let (updatedModel, cmd) = Routing.urlUpdate rl model.routing
  in ({ model | routing = updatedModel }, cmd)

main : Program Never
main =
  Navigation.program Routing.urlParser
    { init = init
    , view = view
    , update = update
    , urlUpdate = urlUpdate
    , subscriptions = subscriptions
    }
