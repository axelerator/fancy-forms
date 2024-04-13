module FancyForms.Widgets.Float exposing
    ( floatInput, FloatInput
    , greaterThan, lesserThan
    )

{-| An float input widget.

@docs floatInput, FloatInput


# Validators

@docs greaterThan, lesserThan

-}

import FancyForms.Form exposing (Msg)
import FancyForms.FormState exposing (Error(..), Validator, Widget, alwaysValid, justChanged, noAttributes, withBlur, withFocus)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, type_, value)
import Html.Events exposing (onBlur, onFocus, onInput)
import Json.Decode as D exposing (Decoder, Value)
import Json.Encode as E
import String exposing (fromFloat)


{-| Messages that can be sent to the float input
-}
type Msg
    = Changed String
    | Focused
    | Blurred


type alias Model =
    { value : String
    , parsedValue : Float
    }


{-| A validator function that ensures the value is greater than `x`
-}
greaterThan : Float -> Validator Float customError
greaterThan x value =
    if value <= x then
        [ MustBeGreaterThan <| fromFloat x ]

    else
        []


{-| A validator function that ensures the value is less than `x`
-}
lesserThan : Float -> Validator Float customError
lesserThan x value =
    if value >= x then
        [ MustBeLesserThan <| fromFloat x ]

    else
        []


{-| Signature of an input widget that collects a `Float`
-}
type alias FloatInput customError =
    Widget Model Msg Float customError


{-| A widget that collects an `Float`
-}
floatInput : List (Attribute Msg) -> FloatInput customError
floatInput attrs =
    { init = \i -> { value = fromFloat i, parsedValue = i }
    , value = .parsedValue
    , default = 0
    , validate = alwaysValid
    , isConsistent = \{ parsedValue, value } -> String.toFloat value == Just parsedValue
    , view =
        \domId innerAttrs model ->
            [ input
                (List.concat
                    [ attrs
                    , innerAttrs
                    , [ id domId
                      , type_ "number"
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
                    String.toFloat val
                        |> Maybe.map (\i -> { model | parsedValue = i, value = val })
                        |> Maybe.withDefault { model | value = val }
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
                , ( "parsedValue", E.float model.parsedValue )
                ]
    , decoderModel =
        D.map2 Model
            (D.field "value" D.string)
            (D.field "parsedValue" D.float)
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
