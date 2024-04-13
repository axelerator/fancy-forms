module FancyForms.Widgets.Int exposing
    ( integerInput
    , greaterThan, lesserThan
    )

{-| An integer input widget.

@docs integerInput


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
import String exposing (fromInt)


type Msg
    = Changed String
    | Focused
    | Blurred


type alias Model =
    { value : String
    , parsedValue : Int
    }


{-| A validator function that ensures the value is greater than `x`
-}
greaterThan : Int -> Validator Int customError
greaterThan x value =
    if value <= x then
        [ MustBeGreaterThan <| fromInt x ]

    else
        []


{-| A validator function that ensures the value is less than `x`
-}
lesserThan : Int -> Validator Int customError
lesserThan x value =
    if value >= x then
        [ MustBeLesserThan <| fromInt x ]

    else
        []

{-| Signature for an input widget that collects an `Int`
-}
type alias IntInput customError = 
    Widget Model Msg Int customError

{-| A widget that collects an `Int`
-}
integerInput : List (Attribute Msg) -> IntInput customError
integerInput attrs =
    { init = \i -> { value = fromInt i, parsedValue = i }
    , value = .parsedValue
    , default = 0
    , validate = alwaysValid
    , isConsistent = \{ parsedValue, value } -> String.toInt value == Just parsedValue
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
                    String.toInt val
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
                , ( "parsedValue", E.int model.parsedValue )
                ]
    , decoderModel =
        D.map2 Model
            (D.field "value" D.string)
            (D.field "parsedValue" D.int)
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
