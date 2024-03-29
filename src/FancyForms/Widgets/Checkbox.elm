module FancyForms.Widgets.Checkbox exposing (checkbox)
{-|
    Checkbox widget

    @docs checkbox
-}

import FancyForms.Form exposing (Msg)
import FancyForms.FormState exposing (Widget, alwaysValid, justChanged)
import Html exposing (input)
import Html.Attributes exposing (checked, id, type_)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E


type alias Msg =
    ()


{-| A checkbox widget the collects a `Bool` value -}
checkbox : Widget Bool Msg Bool customError
checkbox =
    { init = False
    , value = identity
    , validate = alwaysValid
    , view =
        \domId model ->
            [ input [ id domId, type_ "checkbox", onInput (\_ -> ()), checked model ] [] ]
    , update = \_ model -> not model |> justChanged
    , encodeMsg = \_ -> E.object []
    , decoderMsg = D.succeed ()
    , encodeModel = E.bool
    , decoderModel = D.bool
    , blur = identity
    }
