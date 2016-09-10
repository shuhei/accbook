module BudgetItems.Edit exposing (..)

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Form exposing (Form, FieldState)
import Form.Input as Input

import Messages exposing (..)
import Types exposing (BudgetItem, newItem)
import BudgetItems.Form exposing (validateItemForm)

-- import Materialize exposing (..)

type alias ViewModel =
  { form : Form () BudgetItem
  , item : BudgetItem
  }

initialViewModel : ViewModel
initialViewModel =
  { form = Form.initial [] validateItemForm
  , item = newItem
  }

formView : ViewModel -> Html Form.Msg
formView { form, item } =
  let income = Form.getFieldAsBool "isIncome" form
      label' = Form.getFieldAsString "label" form
      amount = Form.getFieldAsString "amount" form
      date = Form.getFieldAsString "date" form
  in div []
       [ inputField
           [ Input.checkboxInput income [ id "item-income" ]
           , label [ for "item-income" ] [ text "Income" ]
           ]
       , textField label' "text"
       , textField amount "number"
       , textField date "date"
       ]

view : ViewModel -> Html Msg
view model =
  div []
    [ App.map ItemFormMsg (formView model)
    , inputField
        [ button [ class "btn", onClick <| ShowBudget model.item.budgetId ] [ text "Cancel" ]
        , button [ class "btn red", onClick (DeleteItemIntent model.item) ] [ text "Delete" ]
        , button [ class "btn", onClick SaveItem ] [ text "Save" ] ]
    ]

inputField : List (Html a) -> Html a
inputField children =
  div [ class "input-field" ] children

textField : FieldState e String -> String -> Html Form.Msg
textField field typeName =
  inputField
    [ Input.textInput field ([ type' typeName ] ++ errorClassesFor field)
    , errorFor field ]

errorFor : FieldState e a -> Html Form.Msg
errorFor field =
  case field.liveError of
    Just error ->
      -- TODO: Style with CSS
      div [ style [ ("color", "#F44336") ] ] [ text <| toString error ]
    Nothing ->
      text ""

errorClassesFor : FieldState e a -> List (Html.Attribute Form.Msg)
errorClassesFor field =
  if field.isChanged
  then case field.liveError of
    Just error ->
      [ class "invalid" ]
    Nothing ->
      [ class "valid" ]
  else []
