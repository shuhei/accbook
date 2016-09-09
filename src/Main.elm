module Main exposing (..)

import Navigation
import Hop.Types exposing (Location)

import Messages exposing (..)
import Models exposing (..)
import Update exposing (update, urlUpdate)
import View exposing (view)
import Budgets.Commands
import BudgetItems.Commands
import Ports exposing (..)
import Routing

init : (Route, Location) -> (AppModel, Cmd Msg)
init rl =
  let cmds = [ Budgets.Commands.fetchAll
             , BudgetItems.Commands.fetchAll
             ]
      cmd = Cmd.batch cmds
  in (initialModel rl, cmd)

-- TODO: Generalize.
subscriptions : AppModel -> Sub Msg
subscriptions model =
  getConfirmation DeleteItem

main : Program Never
main =
  Navigation.program Routing.urlParser
    { init = init
    , view = view
    , update = update
    , urlUpdate = urlUpdate
    , subscriptions = subscriptions
    }
