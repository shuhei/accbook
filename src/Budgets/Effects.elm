module Budgets.Effects (..) where

import Effects exposing (Effects)
import Http
import Json.Decode as Decode exposing ((:=))
import Json.Encode as Encode
import String

import Budgets.Models exposing (..)
import Budgets.Actions exposing (..)
import EffectsHelper

collectionUrl : String
collectionUrl =
  "http://localhost:3000/budgets"

memberUrl : BudgetId -> String
memberUrl id =
  String.join "/" [ collectionUrl, (toString id) ]

fetchAll : Effects Action
fetchAll =
  Http.get collectionDecoder collectionUrl
    |> EffectsHelper.toEffects FetchAllDone

-- Encoder/Decoder

collectionDecoder : Decode.Decoder (List Budget)
collectionDecoder =
  Decode.list memberDecoder

memberDecoder : Decode.Decoder Budget
memberDecoder =
  Decode.object2
    Budget
    ("id" := Decode.int)
    ("name" := Decode.string)

memberBody : Budget -> Http.Body
memberBody item =
  encodeMember item
    |> Encode.encode 0
    |> Http.string

encodeMember : Budget -> Encode.Value
encodeMember budget =
  let list =
        [ ("id", Encode.int budget.id)
        , ("name", Encode.string budget.name)
        ]
  in Encode.object list
