module BudgetItems.Effects (..) where

import Effects exposing (Effects)
import Http
import Task
import Json.Decode as Decode exposing ((:=), int, string)
import Json.Encode as Encode
import Date
import Date.Extra.Format

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
    ("id" := int)
    ("label" := string)
    ("amount" := int)
    ("date" := date)

date : Decode.Decoder Date.Date
date = Decode.customDecoder string Date.fromString

encodeMember : BudgetItem -> Encode.Value
encodeMember item =
  let list =
        [ ("id", Encode.int item.id)
        , ("label", Encode.string item.label)
        , ("amount", Encode.int item.amount)
        -- FIXME: Make ISO string
        , ("date", Encode.string (Date.Extra.Format.utcIsoDateString item.date))
        ]
  in Encode.object list
