module View exposing (..)

import Html exposing (..)
import Html.App as App
import Html.Attributes exposing (..)
import Html.Events exposing (..)

import Messages exposing (..)
import Models exposing (..)
import Budgets.List
import BudgetItems.List
import BudgetItems.Edit
import BudgetItems.Models exposing (BudgetItemId)
import Routing
import Materialize exposing (..)

view : AppModel -> Html Msg
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

sideNav : AppModel -> Html Msg
sideNav model =
  let appName =
        listItem "Accbook"
          [ onClick <| NavigateTo "#/budgetItems" ]
      budgets = List.map (App.map BudgetsMsg) <| Budgets.List.view model.budgets
  in ul [ class "side-nav fixed" ] (appName :: budgets)

titleAndPage : AppModel -> (String, Html Msg)
titleAndPage model =
  case model.routing.route of
    Routing.HomeRoute ->
      ("Budget Items", budgetItemsPage model)
    Routing.BudgetItemsRoute ->
      ("Budget Items", budgetItemsPage model)
    Routing.BudgetItemEditRoute itemId ->
      ("Edit Budget Item", budgetEditPage model itemId)
    Routing.NotFoundRoute ->
      ("Not Found", notFoundView)

budgetItemsPage : AppModel -> Html Msg
budgetItemsPage model =
  let viewModel = { budgetItems = model.budgetItems.items }
  in App.map BudgetItemsMsg <| BudgetItems.List.view viewModel

budgetEditPage : AppModel -> BudgetItemId -> Html Msg
budgetEditPage model itemId =
  let maybeItem =
        model.budgetItems.items
          |> List.filter (\x -> x.id == itemId)
          |> List.head
  in case maybeItem of
    Just item ->
      let viewModel = { form = model.budgetItems.form, item = item }
      in App.map BudgetItemsMsg <| BudgetItems.Edit.view viewModel
    Nothing ->
      notFoundView

notFoundView : Html a
notFoundView =
  div
    []
    [ a [ href "#/budgetItems" ] [ text "Budget Items" ] ]

flash : AppModel -> Html a
flash model =
  case model.errorMessage of
    Nothing ->
     span [] []
    Just message ->
      div
        [ class "card-panel red" ]
        [ span [ class "white-text" ] [ text message ] ]
