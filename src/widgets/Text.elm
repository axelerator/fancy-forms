module Widgets.Text exposing (widget)

import Form exposing (Msg, Widget)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E


type alias Msg =
    String


widget : List (Attribute Msg) -> Widget String Msg String
widget attrs =
    { init = ""
    , value = identity
    , view =
        \domId model ->
            input (attrs ++ [ id domId, onInput identity, value model ]) []
    , update = \msg _ -> msg
    , encodeMsg = E.string
    , decoderMsg = D.string
    , encodeModel = E.string
    , decoderModel = D.string
    }
