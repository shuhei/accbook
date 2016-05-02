module Main (..) where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Signal exposing (Signal, Address)
import Date exposing (Date)
import Debug
import String

-- Model

type alias Model =
  { uid : Int
  , budgetItems : List BudgetItem
  }

type alias BudgetItem =
  { id : Int
  , label : String
  , amount : Int
  , date : Date.Date
  }

newBudgetItem : Int -> String -> Int -> Date.Date -> BudgetItem
newBudgetItem id label amount date =
  { id = id
  , label = label
  , amount = amount
  , date = date
  }

emptyModel : Model
emptyModel =
  { uid = 0
  , budgetItems = []
  }

-- UPDATE

type Action
  = NoOp
  | Add String Int
  | Delete Int

update : Action -> Model -> Model
update action model =
  case (Debug.log "action" action) of
    NoOp -> model
    Add label amount ->
      { model |
        uid = model.uid + 1
      , budgetItems = model.budgetItems ++ [ newBudgetItem model.uid label amount (Date.fromTime 1462172198819) ]
      }
    Delete id ->
      { model | budgetItems = List.filter (\i -> i.id /= id) model.budgetItems }

-- VIEW

iconButton : String -> List Attribute -> Html
iconButton name attrs =
  button
    (class "btn waves-effect waves-light" :: attrs)
    [ i
        [ class "material-icons" ]
        [ text name ]
    ]

formatDate : Date.Date -> String
formatDate d =
  let components =
    [ Date.year d
    , Date.month d |> numericMonth
    , Date.day d
    ]
  in components |> List.map toString |> String.join "-"

numericMonth : Date.Month -> Int
numericMonth m =
  case m of
    Date.Jan -> 1
    Date.Feb -> 2
    Date.Mar -> 3
    Date.Apr -> 4
    Date.May -> 5
    Date.Jun -> 6
    Date.Jul -> 7
    Date.Aug -> 8
    Date.Sep -> 9
    Date.Oct -> 10
    Date.Nov -> 11
    Date.Dec -> 12

budgetItem : Address Action -> BudgetItem -> Html
budgetItem address item =
  tr
    []
    [ td [] [ text (formatDate item.date) ]
    , td [] [ text item.label ]
    , td [] [ text (toString item.amount) ]
    , td [] [ iconButton "delete" [ onClick address (Delete item.id) ] ]
    ]

budgetItemList : Address Action -> Model -> Html
budgetItemList address model =
  div []
    [ div
        [ class "budget-header" ]
        [ h1 [] [ text "Hello" ]
        , div
            [ class "budget-header__buttons" ]
            [ iconButton "settings" [ onClick address NoOp ]
            , iconButton "add" [ onClick address (Add "test" 100) ]
            ]
        ]
    , table
        []
        [ thead
            []
            [ tr
                []
                [ th [] [ text "Date" ]
                , th [] [ text "Label" ]
                , th [] [ text "Amount" ]
                , th [] []
                ]
            ]
        , tbody [] (List.map (budgetItem address) model.budgetItems)
        ]
    ]

css : String -> Html
css path =
  node
    "link"
    [ attribute "rel" "stylesheet"
    , type' "text/css"
    , href path
    ]
    []

view : Address Action -> Model -> Html
view address model =
  div
    [ class "container" ]
    [ css "http://fonts.googleapis.com/icon?family=Material+Icons"
    , css "node_modules/materialize-css/dist/css/materialize.css"
    , budgetItemList address model
    ]

-- MAIN

main : Signal Html
main =
  Signal.map (view actions.address) modelSignal

modelSignal : Signal Model
modelSignal =
  Signal.foldp update emptyModel actions.signal

actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp
