module Widgets.Int exposing (integerInput)

import Form exposing (Msg)
import FormState exposing (Widget, alwaysValid)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, type_, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import FormState exposing (justChanged)


type alias Msg =
    String


type alias Model =
    { value : String
    , parsedValue : Int
    }


integerInput : List (Attribute Msg) -> Widget Model Msg Int customError
integerInput attrs =
    { init = { value = "", parsedValue = 0 }
    , value = .parsedValue
    , validate = alwaysValid
    , view =
        \domId model ->
            [ input (attrs ++ [ id domId, type_ "number", onInput identity, value model.value ]) [] ]
    , update =
        \msg model ->
            String.toInt msg
                |> Maybe.map (\i -> { model | parsedValue = i, value = msg })
                |> Maybe.withDefault { model | value = msg }
                |> justChanged
    , encodeMsg = E.string
    , decoderMsg = D.string
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
    }
