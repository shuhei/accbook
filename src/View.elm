module View (..) where

import Signal exposing (Signal, Address)
import Html exposing (..)
import Html.Attributes exposing (..)

import Actions exposing (..)
import Models exposing (..)
import BudgetItems.List
import BudgetItems.Edit
import BudgetItems.Models exposing (BudgetItemId)
import Routing

css : String -> Html
css path =
  node "link"
    [ attribute "rel" "stylesheet"
    , type' "text/css"
    , href path
    ]
    []

view : Address Action -> AppModel -> Html
view address model =
  let _ = Debug.log "model" model
  in
    div [ class "container" ]
      [ css "http://fonts.googleapis.com/icon?family=Material+Icons"
      , css "../node_modules/materialize-css/dist/css/materialize.css"
      , flash address model
      , page address model
      ]

page : Address Action -> AppModel -> Html
page address model =
  case model.routing.route of
    Routing.BudgetItemsRoute ->
      budgetItemsPage address model
    Routing.BudgetItemEditRoute itemId ->
      budgetEditPage address model itemId
    Routing.NotFoundRoute ->
      notFoundView

budgetItemsPage : Address Action -> AppModel -> Html
budgetItemsPage address model =
  let viewModel = { budgetItems = model.budgetItems }
  in BudgetItems.List.view (Signal.forwardTo address BudgetItemsAction) viewModel

budgetEditPage : Address Action -> AppModel -> BudgetItemId -> Html
budgetEditPage address model itemId =
  let maybeItem =
        model.budgetItems
          |> List.filter (\x -> x.id == itemId)
          |> List.head
  in case maybeItem of
    Just item ->
      let viewModel = { budgetItem = item }
      in BudgetItems.Edit.view (Signal.forwardTo address BudgetItemsAction) viewModel
    Nothing ->
      notFoundView

notFoundView : Html
notFoundView =
  div
    []
    [ h2 [] [ text "Not Found" ]
    , a [ href "#/budgetItems" ] [ text "Budget Items" ]
    ]

flash : Address Action -> AppModel -> Html
flash address model =
  case model.errorMessage of
    Nothing ->
     span [] []
    Just message ->
      div
        [ class "card-panel red" ]
        [ span [ class "white-text" ] [ text message ] ]