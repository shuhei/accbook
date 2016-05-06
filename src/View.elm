module View (..) where

import Signal exposing (Signal, Address)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Actions exposing (..)
import Models exposing (..)
import BudgetItems.List
import BudgetItems.Edit
import BudgetItems.Models exposing (BudgetItemId)
import Routing

view : Address Action -> AppModel -> Html
view address model =
  let _ = Debug.log "model" model
      (title, page) = titleAndPage address model
  in
    div []
      [ header [ class "page-header" ]
          [ div [ class "container" ]
              [ h2 [] [ text title ] ]
          , sideNav address model
          ]
      , div [ class "page-main" ]
          [ div [ class "container" ]
              [ flash address model
              , page
              ]
          ]
      ]

sideNav : Address Action -> AppModel -> Html
sideNav address model =
  ul [ class "side-nav fixed" ]
    [ li []
        [ a
            [ class "waves-effect waves-teal"
            , onClick address <| RoutingAction (Routing.NavigateTo "#/budgetItems")
            ]
            [ text "Accbook" ]
        ]
    ]

titleAndPage : Address Action -> AppModel -> (String, Html)
titleAndPage address model =
  case model.routing.route of
    Routing.BudgetItemsRoute ->
      ("Budget Items", budgetItemsPage address model)
    Routing.BudgetItemEditRoute itemId ->
      ("Edit Budget Item", budgetEditPage address model itemId)
    Routing.NotFoundRoute ->
      ("Not Found", notFoundView)

budgetItemsPage : Address Action -> AppModel -> Html
budgetItemsPage address model =
  let viewModel = { budgetItems = model.budgetItems.items }
  in BudgetItems.List.view (Signal.forwardTo address BudgetItemsAction) viewModel

budgetEditPage : Address Action -> AppModel -> BudgetItemId -> Html
budgetEditPage address model itemId =
  let maybeItem =
        model.budgetItems.items
          |> List.filter (\x -> x.id == itemId)
          |> List.head
  in case maybeItem of
    Just item ->
      let viewModel = { form = model.budgetItems.form, item = item }
      in BudgetItems.Edit.view (Signal.forwardTo address BudgetItemsAction) viewModel
    Nothing ->
      notFoundView

notFoundView : Html
notFoundView =
  div
    []
    [ a [ href "#/budgetItems" ] [ text "Budget Items" ] ]

flash : Address Action -> AppModel -> Html
flash address model =
  case model.errorMessage of
    Nothing ->
     span [] []
    Just message ->
      div
        [ class "card-panel red" ]
        [ span [ class "white-text" ] [ text message ] ]
