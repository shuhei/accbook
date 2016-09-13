module Materialize exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

iconButton : String -> List (Attribute a) -> Html a
iconButton name attrs =
  button
    (class "btn waves-effect waves-light" :: attrs)
    [ i [ class "material-icons" ] [ text name ] ]

textButton : String -> List (Attribute a) -> Html a
textButton name attrs =
  button
    (class "btn waves-effect waves-light" :: attrs)
    [ text name ]

floatingActionButton : String -> List (Attribute a) -> Html a
floatingActionButton name attrs =
  a
    (class "btn-floating btn-large waves-effect waves-light red" :: attrs)
    [ i [ class "material-icons" ] [ text name ] ]

listItem : String -> Bool -> List (Attribute a) -> Html a
listItem name active attrs =
  let klass = if active then [ class "active" ] else []
  in li klass
       [ a
           (class "waves-effect waves-teal" :: attrs)
           [ text name ]
       ]
