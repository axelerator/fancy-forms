module FancyForms.Widgets.Checkbox exposing (checkbox)

import Form exposing (Msg)
import Html exposing (Attribute, input)
import Html.Attributes exposing (checked, id, type_)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import FormState exposing (Widget)
import FormState exposing (alwaysValid)
import FormState exposing (justChanged)


type alias Msg =
    ()


checkbox : Widget Bool Msg Bool customError
checkbox =
    { init = False
    , value = identity
    , validate = alwaysValid
    , view =
        \domId model ->
            [input ([ id domId, type_ "checkbox", onInput (\_ -> ()), checked model ]) []]
    , update = \_ model -> not model |> justChanged
    , encodeMsg = \_ -> E.object []
    , decoderMsg = D.succeed ()
    , encodeModel = E.bool
    , decoderModel = D.bool
    , blur = identity
    }
