module Widgets.Int exposing (greaterThan, integerInput)

import Form exposing (Msg)
import FormState exposing (Error(..), Validator, Widget, alwaysValid, justChanged, withBlur, withFocus)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, type_, value)
import Html.Events exposing (onBlur, onFocus, onInput)
import Json.Decode as D exposing (Decoder, Value)
import Json.Encode as E


type Msg
    = Changed String
    | Focused
    | Blurred


type alias Model =
    { value : String
    , parsedValue : Int
    }


greaterThan : Int -> Validator Model customError
greaterThan x { parsedValue } =
    if parsedValue <= x then
        [ MustBeGreaterThan x ]

    else
        []


integerInput : List (Attribute Msg) -> Widget Model Msg Int customError
integerInput attrs =
    { init = { value = "0", parsedValue = 0 }
    , value = .parsedValue
    , validate = alwaysValid
    , view =
        \domId model ->
            [ input
                (attrs
                    ++ [ id domId
                       , type_ "number"
                       , onInput Changed
                       , onFocus Focused
                       , onBlur Blurred
                       , value model.value
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
