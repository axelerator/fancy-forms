module FancyForms.Widgets.Date exposing (dateInput, Msg)

{-| An date input widget.

@docs dateInput, Msg

-}

import Date exposing (Date, fromIsoString, fromOrdinalDate, fromRataDie, toIsoString, toRataDie)
import FancyForms.Form exposing (Msg)
import FancyForms.FormState exposing (Error(..), Widget, alwaysValid, justChanged, noAttributes, withBlur, withFocus)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, type_, value)
import Html.Events exposing (onBlur, onFocus, onInput)
import Json.Decode as D exposing (Decoder, Value)
import Json.Encode as E


{-| Messages that can be sent to the date input
-}
type Msg
    = Changed String
    | Focused
    | Blurred


type alias Model =
    { value : String
    , parsedValue : Date
    }


{-| Signature for an input widget that collects a `Date` value
-}
type alias DateInput customError =
    Widget Model Msg Date customError


{-| A widget that collects an `Date`
-}
dateInput : List (Attribute Msg) -> DateInput customError
dateInput attrs =
    { init = \i -> { value = toIsoString i, parsedValue = i }
    , value = .parsedValue
    , default = fromOrdinalDate 2024 1
    , validate = alwaysValid
    , isConsistent = \{ parsedValue, value } -> fromIsoString value == Ok parsedValue
    , view =
        \domId innerAttrs model ->
            [ input
                (List.concat
                    [ attrs
                    , innerAttrs
                    , [ id domId
                      , type_ "date"
                      , onInput Changed
                      , onFocus Focused
                      , onBlur Blurred
                      , value model.value
                      ]
                    ]
                )
                []
            ]
    , update =
        \msg model ->
            case msg of
                Changed val ->
                    fromIsoString val
                        |> Result.map (\i -> { model | parsedValue = i, value = val })
                        |> Result.withDefault { model | value = val }
                        |> justChanged

                Focused ->
                    withFocus model

                Blurred ->
                    withBlur model
    , encodeMsg = encodeMsg
    , decoderMsg = decoderMsg
    , encodeModel =
        \model ->
            E.object
                [ ( "value", E.string model.value )
                , ( "parsedValue", E.int <| toRataDie model.parsedValue )
                ]
    , decoderModel =
        D.map2 Model
            (D.field "value" D.string)
            (D.field "parsedValue" D.int |> D.map fromRataDie)
    , blur = identity
    , innerAttributes = noAttributes
    }


encodeMsg : Msg -> Value
encodeMsg msg =
    case msg of
        Focused ->
            E.string "Focused"

        Blurred ->
            E.string "Blurred"

        Changed s ->
            E.object [ ( "Changed", E.string s ) ]


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
                            D.fail ""
                )
        , D.field "Changed" D.string |> D.map Changed
        ]
