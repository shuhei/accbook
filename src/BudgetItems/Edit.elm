module BudgetItems.Edit (..) where

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Signal exposing (Address)
import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)
import Form exposing (Form, FieldState)
import Form.Input as Input

-- import Materialize exposing (..)

type alias ViewModel =
  { form : Form () BudgetItem
  }

initialViewModel : ViewModel
initialViewModel =
  { form = Form.initial [] validate
  }

view : Address Action -> ViewModel -> Html
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
           [ button [ class "btn", onClick address ListAll ] [ text "Cancel" ]
           , button [ class "btn", onClick address Save ] [ text "Save" ] ]
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
      -- TODO: Style with CSS
      div [ style [ ("color", "#F44336") ] ] [ text <| toString error ]
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
