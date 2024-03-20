module Widgets.Text exposing (notBlank, textInput)

import Form exposing (Error(..), Msg, Validator, Widget)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import Form exposing (alwaysValid)


type alias Msg =
    String


notBlank : Validator String customError
notBlank model =
    if model == "" then
        [ MustNotBeBlank ]

    else
        []

textInput : List (Attribute Msg) -> Widget String Msg String customError
textInput attrs =
    { init = ""
    , value = identity
    , validate = alwaysValid
    , view =
        \domId model ->
            [input (attrs ++ [ id domId, onInput identity, value model ]) []]
    , update = \msg _ -> msg
    , encodeMsg = E.string
    , decoderMsg = D.string
    , encodeModel = E.string
    , decoderModel = D.string
    }
