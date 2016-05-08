module BudgetItems.Effects (..) where

import Effects exposing (Effects)
import Http
import Json.Decode as Decode exposing ((:=))
import Json.Encode as Encode
import DateHelpers exposing (..)
import String

import BudgetItems.Actions exposing (..)
import BudgetItems.Models exposing (..)
import EffectsHelper exposing (..)

collectionUrl : String
collectionUrl =
  "http://localhost:3000/budgetItems"

memberUrl : BudgetItemId -> String
memberUrl id =
  String.join "/" [ collectionUrl, (toString id) ]

fetchAll : Effects Action
fetchAll =
  Http.get collectionDecoder collectionUrl
    |> toEffects FetchAllDone

create : BudgetItem -> Effects Action
create item =
  let body = memberBody item
      config =
        { verb = "POST"
        , headers = [ ("Content-Type", "application/json") ]
        , url = collectionUrl
        , body = body
        }
  in Http.send Http.defaultSettings config
       |> Http.fromJson memberDecoder
       |> toEffects CreateDone

delete : BudgetItemId -> Effects Action
delete id =
  let config =
        { verb = "DELETE"
        , headers = [ ("Content-Type", "application/json") ]
        , url = memberUrl id
        , body = Http.empty
        }
  in Http.send Http.defaultSettings config
       |> Http.fromJson (Decode.succeed ())
       |> toEffects (DeleteDone id)

save : BudgetItem -> Effects Action
save item =
  let body = memberBody item
      config =
        { verb = "PATCH"
        , headers = [ ("Content-Type", "application/json") ]
        , url = memberUrl item.id
        , body = body
        }
  in Http.send Http.defaultSettings config
       |> Http.fromJson memberDecoder
       |> toEffects SaveDone

-- Encoder/Decoder

collectionDecoder : Decode.Decoder (List BudgetItem)
collectionDecoder =
  Decode.list memberDecoder

memberDecoder : Decode.Decoder BudgetItem
memberDecoder =
  Decode.object5
    BudgetItem
    ("id" := Decode.int)
    ("label" := Decode.string)
    ("isIncome" := Decode.bool)
    ("amount" := Decode.int)
    ("date" := decodeDate)

memberBody : BudgetItem -> Http.Body
memberBody item =
  encodeMember item
    |> Encode.encode 0
    |> Http.string

encodeMember : BudgetItem -> Encode.Value
encodeMember item =
  let list =
        [ ("id", Encode.int item.id)
        , ("label", Encode.string item.label)
        , ("isIncome", Encode.bool item.isIncome)
        , ("amount", Encode.int item.amount)
        , ("date", encodeDate item.date)
        ]
  in Encode.object list
