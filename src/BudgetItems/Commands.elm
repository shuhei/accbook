module BudgetItems.Commands exposing (fetchAllItems, createItem, saveItem, deleteItem)

import Http
import Json.Decode as Decode exposing ((:=))
import Json.Encode as Encode
import String
import Task

import Types exposing (..)
import Messages exposing (..)
import DateHelper exposing (..)

fetchAllItems : Cmd Msg
fetchAllItems =
  Http.get collectionDecoder collectionUrl
    |> Task.perform FetchAllItemsFail FetchAllItemsDone

createItem : BudgetItem -> Cmd Msg
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
       |> Task.perform CreateItemFail CreateItemDone

deleteItem : BudgetItemId -> Cmd Msg
deleteItem id =
  let config =
        { verb = "DELETE"
        , headers = [ ("Content-Type", "application/json") ]
        , url = memberUrl id
        , body = Http.empty
        }
  in Http.send Http.defaultSettings config
       |> Http.fromJson (Decode.succeed ())
       |> Task.perform DeleteItemFail (\x -> DeleteItemDone id)

saveItem : BudgetItem -> Cmd Msg
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
       |> Task.perform SaveItemFail SaveItemDone

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
