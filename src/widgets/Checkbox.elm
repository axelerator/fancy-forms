module Widgets.Checkbox exposing (widget)

import Form exposing (Msg, Widget, alwaysValid, modelWithNoValidation)
import Html exposing (Attribute, input)
import Html.Attributes exposing (checked, id, type_)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E


type alias Msg =
    ()


widget : List (Attribute Msg) -> Widget Bool Msg Bool
widget attrs =
    { init = False
    , value = identity
    , validate = alwaysValid
    , view =
        \domId model ->
            input (attrs ++ [ id domId, type_ "checkbox", onInput (\_ -> ()), checked model ]) []
    , update = \_ model -> not model
    , encodeMsg = \_ -> E.object []
    , decoderMsg = D.succeed ()
    , encodeModel = E.bool
    , decoderModel = D.bool
    }
