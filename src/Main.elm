module Main (..) where

import StartApp
import Signal exposing (Signal, Address)
import Effects exposing (Effects, Never)
import Task exposing (Task)
import Html exposing (Html)

import Actions exposing (..)
import Models exposing (..)
import Update exposing (update)
import View exposing (view)
import Routing

init : (AppModel, Effects Action)
init =
  (initialModel, Effects.none)

routerSignal : Signal Action
routerSignal =
  Signal.map RoutingAction Routing.signal

app : StartApp.App AppModel
app =
  StartApp.start
    { init = init
    , view = view
    , update = update
    , inputs = [ routerSignal ]
    }

main : Signal Html
main =
  app.html

port runner : Signal (Task Never ())
port runner =
  app.tasks

port routeRunTask : Task () ()
port routeRunTask =
  Routing.run
