module Helpers (..) where

import Date exposing (Date)
import String

formatDate : Date.Date -> String
formatDate d =
  let components = [ Date.year d, Date.month d |> numericMonth, Date.day d ]
  in components |> List.map toString |> String.join "-"

numericMonth : Date.Month -> Int
numericMonth m =
  case m of
    Date.Jan -> 1
    Date.Feb -> 2
    Date.Mar -> 3
    Date.Apr -> 4
    Date.May -> 5
    Date.Jun -> 6
    Date.Jul -> 7
    Date.Aug -> 8
    Date.Sep -> 9
    Date.Oct -> 10
    Date.Nov -> 11
    Date.Dec -> 12
