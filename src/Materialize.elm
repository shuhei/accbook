module Materialize (..) where

import Html exposing (..)
import Html.Attributes exposing (..)

iconButton : String -> List Attribute -> Html
iconButton name attrs =
  button
    (class "btn waves-effect waves-light" :: attrs)
    [ i [ class "material-icons" ] [ text name ] ]

textButton : String -> List Attribute -> Html
textButton name attrs =
  button
    (class "btn waves-effect waves-light" :: attrs)
    [ text name ]

floatingActionButton : String -> List Attribute -> Html
floatingActionButton name attrs =
  a
    (class "btn-floating btn-large waves-effect waves-light red" :: attrs)
    [ i [ class "material-icons" ] [ text name ] ]
