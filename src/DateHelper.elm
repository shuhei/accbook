module DateHelper exposing (..)

import Date exposing (Date)
import Json.Decode as Decode
import Json.Encode as Encode
import Date.Extra.Format as Format
import Date.Extra.Config.Config_en_us exposing (config)

-- YYYY/m/d
humanDate : Date.Date -> String
humanDate d =
  Format.format config "%Y/%-m/%-d" d

-- YYYY-mm-dd
formatIsoDate : Date.Date -> String
formatIsoDate d =
  Format.format config Format.isoDateFormat d

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

decodeDate : Decode.Decoder Date.Date
decodeDate = Decode.customDecoder Decode.string Date.fromString

encodeDate : Date.Date -> Decode.Value
encodeDate = Encode.string << Format.utcIsoString
