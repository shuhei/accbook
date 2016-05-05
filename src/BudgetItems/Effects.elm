module BudgetItems.Effects (..) where

import Effects exposing (Effects)
import Http
import Task
import Json.Decode as Decode exposing ((:=))
import Json.Encode as Encode
import DateHelpers exposing (..)

import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)

fetchAll : Effects Action
fetchAll =
  Http.get collectionDecoder fetchAllUrl
    |> Task.toResult
    |> Task.map FetchAllDone
    |> Effects.task

fetchAllUrl : String
fetchAllUrl =
  "http://localhost:3000/budgetItems"

create : BudgetItem -> Effects Action
create item =
  let body =
        encodeMember item
          |> Encode.encode 0
          |> Http.string
      config =
        { verb = "POST"
        , headers = [ ("Content-Type", "application/json") ]
        , url = createUrl
        , body = body
        }
  in Http.send Http.defaultSettings config
       |> Http.fromJson memberDecoder
       |> Task.toResult
       |> Task.map CreateDone
       |> Effects.task

createUrl : String
createUrl = "http://localhost:3000/budgetItems"


-- Encoder/Decoder

collectionDecoder : Decode.Decoder (List BudgetItem)
collectionDecoder =
  Decode.list memberDecoder

memberDecoder : Decode.Decoder BudgetItem
memberDecoder =
  Decode.object4
    BudgetItem
    ("id" := Decode.int)
    ("label" := Decode.string)
    ("amount" := Decode.int)
    ("date" := decodeDate)

encodeMember : BudgetItem -> Encode.Value
encodeMember item =
  let list =
        [ ("id", Encode.int item.id)
        , ("label", Encode.string item.label)
        , ("amount", Encode.int item.amount)
        , ("date", encodeDate item.date)
        ]
  in Encode.object list
