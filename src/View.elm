module View exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

import Types exposing (Route (..), Budget, BudgetId, BudgetItem, BudgetItemId)
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
  let appName = listItem "Accbook" False []
      selectedBudgetId =
        case model.route of
          BudgetRoute budgetId ->
            Just budgetId
          _ ->
            Nothing
      budgets = Budgets.List.view selectedBudgetId model.budgets
  in ul [ class "side-nav fixed" ] (appName :: budgets)

titleAndPage : Model -> (String, Html Msg)
titleAndPage model =
  case model.route of
    HomeRoute ->
      ("Home", homePage model)
    BudgetRoute budgetId ->
      case findBudget budgetId model.budgets of
        Just budget ->
          (budget.name, budgetPage model budget)
        Nothing ->
          notFound
    BudgetItemEditRoute itemId ->
      case findBudgetItem itemId model.budgetItems of
        Just item ->
          ("Edit Budget Item", budgetEditPage model item)
        Nothing ->
          notFound
    NotFoundRoute ->
      notFound

-- Pages

homePage : Model -> Html Msg
homePage model =
  p [] [ text "Hello, World!" ]

budgetPage : Model -> Budget -> Html Msg
budgetPage model budget =
  let viewModel = { budgetItems = selectBudgetItems budget.id model.budgetItems
                  , budget = budget }
  in BudgetItems.List.view viewModel

budgetEditPage : Model -> BudgetItem -> Html Msg
budgetEditPage model item =
  let viewModel = { form = model.budgetItemForm, item = item }
  in BudgetItems.Edit.view viewModel

notFoundPage : Html a
notFoundPage =
  div
    []
    [ p [] [ text "Not found" ] ]

notFound : (String, Html a)
notFound =
  ("404", notFoundPage)

-- Helpers

flash : Model -> Html a
flash model =
  case model.errorMessage of
    Nothing ->
     span [] []
    Just message ->
      div
        [ class "card-panel red" ]
        [ span [ class "white-text" ] [ text message ] ]
