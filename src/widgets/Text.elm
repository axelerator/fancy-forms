module Widgets.Text exposing (notBlank, textInput)

import Form exposing (Msg)
import FormState exposing (Error(..), Validator, Widget, alwaysValid, justChanged, withFocus)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, value)
import Html.Events exposing (onInput)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import Html.Events exposing (onFocus)


type Msg
    = Changed String
    | Focused


notBlank : Validator String customError
notBlank model =
    if Debug.log "not blank" (model == "") then
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
            [ input (attrs ++ [ id domId, onInput Changed, onFocus Focused, value model ]) [] ]
    , update =
        \msg model ->
            case msg of
                Focused ->
                    withFocus model

                Changed s ->
                    justChanged s
    , encodeMsg = encodeMsg
    , decoderMsg = decoderMsg
    , encodeModel = E.string
    , decoderModel = D.string
    }


encodeMsg : Msg -> Value
encodeMsg msg =
    case msg of
        Changed s ->
            E.object [ ( "Changed", E.string s ) ]

        Focused ->
            E.string "Focused"


decoderMsg : Decoder Msg
decoderMsg =
    D.oneOf
        [ D.string
            |> D.andThen
                (\s ->
                    if s == "Focused" then
                        D.succeed Focused

                    else
                        D.fail ""
                )
        , D.field "Changed" D.string |> D.map Changed
        ]
