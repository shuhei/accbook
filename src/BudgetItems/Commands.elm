module BudgetItems.Commands exposing
  ( fetchAllItems
  , createItem
  , saveItem
  , deleteItem
  )

import Http
import Json.Decode as Decode exposing ((:=))
import Json.Encode as Encode
import String
import Task exposing (Task)

import Types exposing (..)
import DateHelper exposing (..)

fetchAllItems : Task Http.Error (List BudgetItem)
fetchAllItems =
  Http.get collectionDecoder collectionUrl

createItem : BudgetItem -> Task Http.Error BudgetItem
createItem item =
  let body = memberBody item
      config =
        { verb = "POST"
        , headers = [ ("Content-Type", "application/json") ]
        , url = collectionUrl
        , body = body
        }
  in Http.send Http.defaultSettings config
       |> Http.fromJson memberDecoder

deleteItem : BudgetItemId -> Task Http.Error BudgetItemId
deleteItem id =
  let config =
        { verb = "DELETE"
        , headers = [ ("Content-Type", "application/json") ]
        , url = memberUrl id
        , body = Http.empty
        }
  in Http.send Http.defaultSettings config
       |> Http.fromJson (Decode.succeed id)

saveItem : BudgetItem -> Task Http.Error BudgetItem
saveItem item =
  let body = memberBody item
      config =
        { verb = "PATCH"
        , headers = [ ("Content-Type", "application/json") ]
        , url = memberUrl item.id
        , body = body
        }
  in Http.send Http.defaultSettings config
       |> Http.fromJson memberDecoder

-- URL

collectionUrl : String
collectionUrl =
  "http://localhost:3000/budgetItems"

memberUrl : BudgetItemId -> String
memberUrl id =
  String.join "/" [ collectionUrl, (toString id) ]

-- Encoder/Decoder

collectionDecoder : Decode.Decoder (List BudgetItem)
collectionDecoder =
  Decode.list memberDecoder

memberDecoder : Decode.Decoder BudgetItem
memberDecoder =
  Decode.object6
    BudgetItem
    ("id" := Decode.int)
    ("budgetId" := Decode.int)
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
  Encode.object
    [ ("id", Encode.int item.id)
    , ("budgetId", Encode.int item.budgetId)
    , ("label", Encode.string item.label)
    , ("isIncome", Encode.bool item.isIncome)
    , ("amount", Encode.int item.amount)
    , ("date", encodeDate item.date)
    ]
