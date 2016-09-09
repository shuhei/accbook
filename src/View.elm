module View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Types exposing (Route (..), BudgetItemId)
import Messages exposing (..)
import Models exposing (..)
import Budgets.List
import BudgetItems.List
import BudgetItems.Edit
import Materialize exposing (..)

view : Model -> Html Msg
view model =
  let _ = Debug.log "model" model
      (title, page) = titleAndPage model
  in
    div []
      [ header [ class "page-header" ]
          [ div [ class "container" ]
              [ h2 [] [ text title ] ]
          , sideNav model
          ]
      , div [ class "page-main" ]
          [ div [ class "container" ]
              [ flash model
              , page
              ]
          ]
      ]

sideNav : Model -> Html Msg
sideNav model =
  let appName =
        listItem "Accbook"
          [ onClick ListAllItems ]
      budgets = Budgets.List.view model.budgets
  in ul [ class "side-nav fixed" ] (appName :: budgets)

titleAndPage : Model -> (String, Html Msg)
titleAndPage model =
  case model.route of
    HomeRoute ->
      ("Budget Items", budgetItemsPage model)
    BudgetItemsRoute ->
      ("Budget Items", budgetItemsPage model)
    BudgetItemEditRoute itemId ->
      ("Edit Budget Item", budgetEditPage model itemId)
    NotFoundRoute ->
      ("Not Found", notFoundView)

budgetItemsPage : Model -> Html Msg
budgetItemsPage model =
  let viewModel = { budgetItems = model.budgetItems }
  in BudgetItems.List.view viewModel

budgetEditPage : Model -> BudgetItemId -> Html Msg
budgetEditPage model itemId =
  let maybeItem =
        model.budgetItems
          |> List.filter (\x -> x.id == itemId)
          |> List.head
  in case maybeItem of
    Just item ->
      let viewModel = { form = model.budgetItemForm, item = item }
      in BudgetItems.Edit.view viewModel
    Nothing ->
      notFoundView

notFoundView : Html a
notFoundView =
  div
    []
    [ a [ href "#/budgetItems" ] [ text "Budget Items" ] ]

flash : Model -> Html a
flash model =
  case model.errorMessage of
    Nothing ->
     span [] []
    Just message ->
      div
        [ class "card-panel red" ]
        [ span [ class "white-text" ] [ text message ] ]
