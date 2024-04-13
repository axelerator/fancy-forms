module FancyForms.Widgets.Text exposing
    ( textInput, TextInput
    , notBlank
    )

{-| A text input widget

@docs textInput, TextInput


# Validators

@docs notBlank

-}

import FancyForms.Form exposing (Msg)
import FancyForms.FormState exposing (Error(..), Validator, Widget, alwaysValid, justChanged, noAttributes, withBlur, withFocus)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, value)
import Html.Events exposing (onBlur, onFocus, onInput)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)


{-| Messages that can be sent to the text input
-}
type Msg
    = Changed String
    | Focused
    | Blurred


{-| A validator function that ensures that the given string is not empty.
-}
notBlank : Validator String customError
notBlank model =
    if Debug.log "notBlank" model == "" then
        [ MustNotBeBlank ]

    else
        []


{-| Signature for a text input widget
-}
type alias TextInput customError =
    Widget String Msg String customError


{-| A text input widget
-}
textInput : List (Attribute Msg) -> TextInput customError
textInput attrs =
    { init = identity
    , value = identity
    , default = ""
    , validate = alwaysValid
    , isConsistent = \_ -> True
    , view =
        \domId innerAttrs model ->
            [ input
                (List.concat
                    [ attrs
                    , innerAttrs
                    , [ id domId, onInput Changed, onFocus Focused, onBlur Blurred, value model ]
                    ]
                )
                []
            ]
    , update =
        \msg model ->
            case msg of
                Focused ->
                    withFocus model

                Blurred ->
                    withBlur model

                Changed s ->
                    justChanged s
    , encodeMsg = encodeMsg
    , decoderMsg = decoderMsg
    , encodeModel = E.string
    , decoderModel = D.string
    , blur = identity
    , innerAttributes = noAttributes
    }


encodeMsg : Msg -> Value
encodeMsg msg =
    case msg of
        Changed s ->
            E.object [ ( "Changed", E.string s ) ]

        Focused ->
            E.string "Focused"

        Blurred ->
            E.string "Blurred"


decoderMsg : Decoder Msg
decoderMsg =
    D.oneOf
        [ D.string
            |> D.andThen
                (\s ->
                    case s of
                        "Focused" ->
                            D.succeed Focused

                        "Blurred" ->
                            D.succeed Blurred

                        _ ->
                            D.fail "Expected 'Focused' or 'Blurred'"
                )
        , D.field "Changed" D.string |> D.map Changed
        ]
