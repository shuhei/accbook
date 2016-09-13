port module Ports exposing (..)

port askConfirmation : (Int, String) -> Cmd msg
port getConfirmation : (Int -> msg) -> Sub msg
