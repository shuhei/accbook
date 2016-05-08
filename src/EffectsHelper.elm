module EffectsHelper (..) where


import Http
import Task exposing (Task)
import Effects exposing (Effects)

toEffects : (Result Http.Error x -> a) -> Task Http.Error x -> Effects a
toEffects makeAction task =
  task
    |> Task.toResult
    |> Task.map makeAction
    |> Effects.task
