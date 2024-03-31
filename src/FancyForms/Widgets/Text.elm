module FancyForms.Widgets.Text exposing (notBlank, textInput)
{-| A text input widget 
@docs textInput

# Validators

@docs notBlank
-}

import FancyForms.Form exposing (Msg)
import FancyForms.FormState exposing (Error(..), Validator, Widget, alwaysValid, justChanged, withBlur, withFocus)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, value)
import Html.Events exposing (onBlur, onFocus, onInput)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import Maybe exposing (withDefault)


type Msg
    = Changed String
    | Focused
    | Blurred

{-| A validator function that ensures that the given string is not empty. 
-}
notBlank : Validator String customError
notBlank model =
    if model == "" then
        [ MustNotBeBlank ]

    else
        []

{-| A text input widget -}
textInput : List (Attribute Msg) -> Widget String Msg String customError
textInput attrs =
    { init = withDefault ""
    , value = identity
    , validate = alwaysValid
    , isConsistent = (\_ -> True)
    , view =
        \domId model ->
            [ input
                (attrs
                    ++ [ id domId, onInput Changed, onFocus Focused, onBlur Blurred, value model ]
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
