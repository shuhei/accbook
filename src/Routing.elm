-- http://www.elm-tutorial.org/070_routing/router.html
module Routing exposing (..)

import Navigation
import Hop exposing (makeUrl, matchUrl)
import Hop.Types exposing (Config, Location, PathMatcher, Router, newLocation)
import Hop.Matchers exposing (match1, match2, match3, int)

import Types exposing (Route (..), BudgetItemId)

routerConfig : Config Route
routerConfig =
  { hash = True
  , basePath = ""
  , matchers = matchers
  , notFound = NotFoundRoute
  }

urlParser : Navigation.Parser (Route, Location)
urlParser =
  Navigation.makeParser (.href >> matchUrl routerConfig)

-- Returns a Cmd to change URL.
navigateTo : String -> Cmd msg
navigateTo url =
  Navigation.newUrl <| makeUrl routerConfig url

-- Matchers

indexMatcher : PathMatcher Route
indexMatcher =
  match1 HomeRoute "/"

budgetMatcher : PathMatcher Route
budgetMatcher =
  match2 BudgetRoute "/budgets/" int

budgetItemEditMatcher : PathMatcher Route
budgetItemEditMatcher =
  match3 BudgetItemEditRoute "/budgetItems/" int "/edit"

matchers : List (PathMatcher Route)
matchers =
  [ indexMatcher
  , budgetMatcher
  , budgetItemEditMatcher
  ]
