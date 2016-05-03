module Main (..) where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Signal exposing (Signal, Address)
import Date exposing (Date)
import String

import BudgetItemForm

-- MODEL

type alias Model =
  { uid : Int
  , budgetItems : List BudgetItem
  , budgetItemForm : BudgetItemForm.Model
  }

type alias BudgetItem =
  { id : Int
  , label : String
  , amount : Int
  , date : Date.Date
  }

init : Model
init =
  { uid = 0
  , budgetItems = []
  , budgetItemForm = BudgetItemForm.init
  }

-- UPDATE

type Action
  = NoOp
  | Add String Int
  | Delete Int
  | BudgetItemFormAction BudgetItemForm.Action

update : Action -> Model -> Model
update action model =
  case action of
    Add label amount ->
      { model |
        uid = model.uid + 1
      , budgetItems = model.budgetItems ++ [ BudgetItem model.uid label amount (Date.fromTime 1462172198819) ]
      }
    Delete id ->
      { model | budgetItems = List.filter (\i -> i.id /= id) model.budgetItems }
    BudgetItemFormAction act ->
      { model | budgetItemForm = BudgetItemForm.update act model.budgetItemForm }
    _ -> model

-- VIEW

iconButton : String -> List Attribute -> Html
iconButton name attrs =
  button
    (class "btn waves-effect waves-light" :: attrs)
    [ i [ class "material-icons" ] [ text name ] ]

formatDate : Date.Date -> String
formatDate d =
  let components = [ Date.year d, Date.month d |> numericMonth, Date.day d ]
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

css : String -> Html
css path =
  node "link"
    [ attribute "rel" "stylesheet"
    , type' "text/css"
    , href path
    ]
    []

budgetItem : Address Action -> BudgetItem -> Html
budgetItem address item =
  tr []
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
            , iconButton "add" [ onClick address NoOp ]
            ]
        ]
    , table []
        [ thead []
            [ tr []
                [ th [] [ text "Date" ]
                , th [] [ text "Label" ]
                , th [] [ text "Amount" ]
                , th [] []
                ]
            ]
        , tbody [] (List.map (budgetItem address) model.budgetItems)
        ]
    ]

view : Address Action -> Model -> Html
view address model =
  div [ class "container" ]
    [ css "http://fonts.googleapis.com/icon?family=Material+Icons"
    , css "node_modules/materialize-css/dist/css/materialize.css"
    , budgetItemList address model
    , BudgetItemForm.view (Signal.forwardTo address BudgetItemFormAction) model.budgetItemForm
    ]

-- MAIN

main : Signal Html
main =
  Signal.map (view actions.address) modelSignal

modelSignal : Signal Model
modelSignal =
  Signal.foldp update init actions.signal

actions : Signal.Mailbox Action
actions =
  Signal.mailbox NoOp
