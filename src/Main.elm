module Main exposing (..)

import Navigation
import Hop.Types exposing (Location)

import Types exposing (..)
import Messages exposing (..)
import Models exposing (..)
import Update exposing (update, urlUpdate)
import View exposing (view)
import Ports exposing (..)
import Routing

init : (Route, Location) -> (Model, Cmd Msg)
init rl =
  (initialModel rl, sendCommand Init)

-- TODO: Generalize.
subscriptions : Model -> Sub Msg
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
