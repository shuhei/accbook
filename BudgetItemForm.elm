module BudgetItemForm (..) where

-- import Date exposing (Date)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (onClick)
import Signal exposing (Signal, Address)
import Debug
import Form exposing (Form, FieldState)
import Form.Validate as Validate exposing (..)
import Form.Input as Input
import Date exposing (Date)

-- MODEL

type alias Item =
  { income: Bool
  , label : String
  , amount : Int
  , date : Date
  }

type alias Model =
  { form : Form () Item }

init : Model
init =
  { form = Form.initial [] validate }

validate : Validation () Item
validate =
  form4 Item
    (get "income" bool)
    (get "label" string)
    (get "amount" int)
    (get "date" date)

-- UPDATE

type Action
  = NoOp
  | FormAction Form.Action
  | Save

update : Action -> Model -> Model
update action ({form} as model) =
  case (Debug.log "action" action) of
    NoOp ->
      model
    FormAction formAction ->
      { model | form = Form.update formAction form }
    Save ->
      case Form.getOutput (Debug.log "output" form) of
        Just output -> model
        Nothing -> model

-- VIEW

view : Address Action -> Model -> Html
view address {form} =
  let formAddress = Signal.forwardTo address FormAction
      income = Form.getFieldAsBool "income" form
      label' = Form.getFieldAsString "label" form
      amount = Form.getFieldAsString "amount" form
      date = Form.getFieldAsString "date" form
  in div []
       [ h4 [] [ text "New Budget Item" ]
       , inputField
           [ Input.checkboxInput income formAddress [ id "item-income" ]
           , label [ for "item-income" ] [ text "Income" ]
           ]
       , textField formAddress label' "text"
       , textField formAddress amount "number"
       , textField formAddress date "date"
       , inputField
           [ button [ class "btn" , onClick address Save ] [ text "Save" ] ]
       ]

inputField : List Html -> Html
inputField children =
  div [ class "input-field" ] children

textField : Address Form.Action -> FieldState e String -> String -> Html
textField address field typeName =
  inputField
    [ Input.textInput field address ([ type' typeName ] ++ errorClassesFor field)
    , errorFor field ]

errorFor : FieldState e a -> Html
errorFor field =
  case field.liveError of
    Just error ->
      div [ class "error" ] [ text <| toString error ]
    Nothing ->
      text ""

errorClassesFor : FieldState e a -> List Html.Attribute
errorClassesFor field =
  if field.isChanged
  then case field.liveError of
    Just error ->
      [ class "invalid" ]
    Nothing ->
      [ class "valid" ]
  else []
