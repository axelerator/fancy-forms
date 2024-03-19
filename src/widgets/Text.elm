module Widgets.Text exposing (widget, notBlank)

import Form exposing (Msg, Widget)
import Html exposing (Attribute, input)
import Html.Attributes exposing (id, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import Form exposing (alwaysValid)
import Form exposing (Error(..))
import Form exposing (Validator)


type alias Msg =
    String

notBlank : Validator String
notBlank model =
    if model == "" then
        [MustNotBeBlank]
    else
        []

concatValidators : List (Validator model) -> Validator model
concatValidators validators model =
    List.map (\validator -> validator model) validators
    |> List.concat

widget : List (Attribute Msg) -> (List (Validator String)) -> Widget String Msg String
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
