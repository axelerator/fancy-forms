module Widgets.Text exposing (notBlank, widget)

import Form exposing (Error(..), Msg, Validator, Widget)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E


type alias Msg =
    String


notBlank : Validator String customError
notBlank model =
    if model == "" then
        [ MustNotBeBlank ]

    else
        []


concatValidators : List (Validator model customError) -> Validator model customError
concatValidators validators model =
    List.map (\validator -> validator model) validators
        |> List.concat


widget : List (Attribute Msg) -> List (Validator String customError) -> Widget String Msg String customError
widget attrs validators =
    { init = ""
    , value = identity
    , validate = concatValidators validators
    , view =
        \domId model ->
            input (attrs ++ [ id domId, onInput identity, value model ]) []
    , update = \msg _ -> msg
    , encodeMsg = E.string
    , decoderMsg = D.string
    , encodeModel = E.string
    , decoderModel = D.string
    }
