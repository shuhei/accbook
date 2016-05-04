module Materialize (..) where

import Html exposing (..)
import Html.Attributes exposing (..)

iconButton : String -> List Attribute -> Html
iconButton name attrs =
  a
    (class "btn waves-effect waves-light" :: attrs)
    [ i [ class "material-icons" ] [ text name ] ]

textButton : String -> List Attribute -> Html
textButton name attrs =
  a
    (class "btn waves-effect waves-light" :: attrs)
    [ text name ]
