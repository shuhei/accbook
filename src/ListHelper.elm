module ListHelper exposing (..)

find : (a -> Bool) -> List a -> Maybe a
find f xs =
  List.head <| List.filter f xs
