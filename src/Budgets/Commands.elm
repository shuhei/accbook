module Budgets.Commands exposing (fetchAllBudgets)

import Http
import Task
import Json.Decode as Decode exposing ((:=))
import Json.Encode as Encode
import String

import Types exposing (Budget, BudgetId)
import Messages exposing (Msg (..))

fetchAllBudgets : Cmd Msg
fetchAllBudgets =
  Http.get collectionDecoder collectionUrl
    |> Task.perform FetchAllBudgetsFail FetchAllBudgetsDone

-- URL

collectionUrl : String
collectionUrl =
  "http://localhost:3000/budgets"

memberUrl : BudgetId -> String
memberUrl id =
  String.join "/" [ collectionUrl, (toString id) ]

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
