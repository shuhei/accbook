module BudgetItems.Effects (..) where

import Effects exposing (Effects)
import Http
import Task
import Json.Decode as Decode exposing ((:=), int, string)
import Date

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
