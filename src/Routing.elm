-- http://www.elm-tutorial.org/070_routing/router.html
module Routing exposing (..)

import Navigation
import Hop exposing (makeUrl, matchUrl)
import Hop.Types exposing (Config, Location, PathMatcher, Router, newLocation)
import Hop.Matchers exposing (match1, match2, match3, int)

import BudgetItems.Models exposing (BudgetItemId)

type Route
  = HomeRoute
  | BudgetItemsRoute
  | BudgetItemEditRoute BudgetItemId
  | NotFoundRoute

type alias Model =
  { location : Location
  , route : Route
  }

initialModel : (Route, Location) -> Model
initialModel (route, location) =
  { route = route, location = location }

routerConfig : Config Route
routerConfig =
  { hash = True
  , basePath = ""
  , matchers = matchers
  , notFound = NotFoundRoute
  }

urlUpdate : (Route, Location) -> Model -> (Model, Cmd msg)
urlUpdate (route, location) model =
  let cmd = case route of
              -- TODO: Any better way to redirect?
              HomeRoute ->
                navigateTo "#/budgetItems"
              _ ->
                Cmd.none
  in ({ route = route, location = location }, cmd)

urlParser : Navigation.Parser (Route, Location)
urlParser =
  Navigation.makeParser (.href >> matchUrl routerConfig)

-- Returns a Cmd to change URL.
navigateTo : String -> Cmd msg
navigateTo url =
  Navigation.newUrl <| makeUrl routerConfig url

indexMatcher : PathMatcher Route
indexMatcher =
  match1 HomeRoute "/"

budgetItemsMatcher : PathMatcher Route
budgetItemsMatcher =
  match1 BudgetItemsRoute "/budgetItems"

budgetItemEditMatcher : PathMatcher Route
budgetItemEditMatcher =
  match3 BudgetItemEditRoute "/budgetItems/" int "/edit"

matchers : List (PathMatcher Route)
matchers =
  [ indexMatcher
  , budgetItemsMatcher
  , budgetItemEditMatcher
  ]
