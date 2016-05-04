-- http://www.elm-tutorial.org/070_routing/router.html
module Routing (..) where

import Task exposing (Task)
import Effects exposing (Effects, Never)
import Hop
import Hop.Types exposing (Config, Location, PathMatcher, Router, newLocation)
import Hop.Navigate exposing (navigateTo)
import Hop.Matchers exposing (match1, match2, match3, int)

import BudgetItems.Models exposing (BudgetItemId)

type Route
  = BudgetItemsRoute
  | BudgetItemEditRoute BudgetItemId
  | NotFoundRoute

type Action
  = HopAction ()
  | ApplyRoute (Route, Location)
  | NavigateTo String

type alias Model =
  { location : Location
  , route : Route
  }

initialModel : Model
initialModel =
  { location = newLocation
  , route = BudgetItemsRoute
  }

routerConfig : Config Route
routerConfig =
  { hash = True
  , basePath = ""
  , matchers = matchers
  , notFound = NotFoundRoute
  }

update : Action -> Model -> (Model, Effects Action)
update action model =
  case action of
    NavigateTo path ->
      (model, Effects.map HopAction (navigateTo routerConfig path))
    ApplyRoute (route, location) ->
      ({ model | route = route, location = location }, Effects.none)
    HopAction () ->
      (model, Effects.none)

indexMatcher : PathMatcher Route
indexMatcher =
  match1 BudgetItemsRoute "/"

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

router : Router Route
router =
  Hop.new routerConfig

run : Task () ()
run =
  router.run

signal : Signal Action
signal =
  Signal.map ApplyRoute router.signal
