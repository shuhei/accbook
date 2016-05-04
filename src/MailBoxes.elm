-- http://www.elm-tutorial.org/090_showing_errors/auxiliary_mailbox.html
module Mailboxes (..) where

import Signal exposing (Mailbox)

import Actions exposing (..)

actionsMailbox : Mailbox Action
actionsMailbox =
  Signal.mailbox NoOp
