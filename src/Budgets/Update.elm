module Budgets.Update (..) where

import Effects exposing (Effects)

import Budgets.Actions exposing (..)
import Budgets.Models exposing (..)

update : Action -> Model -> (Model, Effects Action)
update action model =
  case action of
    Show id ->
      -- TODO: Navigate to #budgets/:id
      let fx = Effects.none
      in (model, fx)
    FetchAllDone result ->
      case result of
        Ok budgets ->
          ({ model | budgets = budgets }, Effects.none)
        Err errors ->
          -- TODO: Show message
          (model, Effects.none)
    _ ->
      (model, Effects.none)
