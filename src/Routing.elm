-- http://www.elm-tutorial.org/070_routing/router.html
module Routing (..) where

import Task exposing (Task)
import Effects exposing (Effects, Never)
import Signal exposing (Address)
import Hop
import Hop.Types exposing (Config, Location, PathMatcher, Router, newLocation)
import Hop.Navigate exposing (navigateTo)
import Hop.Matchers exposing (match1, match2, match3, int)

import BudgetItems.Models exposing (BudgetItemId)

type Route
  = HomeRoute
  | BudgetItemsRoute
  | BudgetItemEditRoute BudgetItemId
  | NotFoundRoute

type Action
  = HopAction ()
  | ApplyRoute (Route, Location)
  | NavigateTo String
  | TaskDone ()

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

type alias Context =
  { navigateAddress : Address String }

update : Context -> Action -> Model -> (Model, Effects Action)
update ctx action model =
  case action of
    NavigateTo path ->
      (model, Effects.map HopAction (navigateTo routerConfig path))
    ApplyRoute (route, location) ->
      case route of
        -- Redirect
        HomeRoute ->
          let fx = Signal.send ctx.navigateAddress "#/budgetItems"
                     |> Effects.task
                     |> Effects.map TaskDone
          in (model, fx)
        _ ->
          ({ model | route = route, location = location }, Effects.none)
    HopAction () ->
      (model, Effects.none)
    TaskDone () ->
      (model, Effects.none)

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

router : Router Route
router =
  Hop.new routerConfig

run : Task () ()
run =
  router.run

signal : Signal Action
signal =
  Signal.map ApplyRoute router.signal
