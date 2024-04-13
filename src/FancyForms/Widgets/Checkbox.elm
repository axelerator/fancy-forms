module FancyForms.Widgets.Checkbox exposing (checkbox, BoolInput)

{-| Checkbox widget

@docs checkbox, BoolInput

-}

import FancyForms.Form exposing (Msg)
import FancyForms.FormState exposing (Widget, alwaysValid, justChanged, noAttributes)
import Html exposing (input)
import Html.Attributes exposing (checked, id, type_)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E

{-| Messages that can be sent to the checkbox
-}
type alias Msg =
    ()

{-| Signature for an input that collects a `Bool` value
-}
type alias BoolInput customError = Widget Bool Msg Bool customError

{-| A checkbox widget the collects a `Bool` value
-}
checkbox : BoolInput customError
checkbox =
    { init = identity
    , value = identity
    , default = False
    , validate = alwaysValid
    , isConsistent = \_ -> True
    , view =
        \domId innerAttrs model ->
            [ input
                (List.concat
                    [ [ id domId, type_ "checkbox", onInput (\_ -> ()), checked model ]
                    , innerAttrs
                    ]
                )
                []
            ]
    , update = \_ model -> not model |> justChanged
    , encodeMsg = \_ -> E.object []
    , decoderMsg = D.succeed ()
    , encodeModel = E.bool
    , decoderModel = D.bool
    , blur = identity
    , innerAttributes = noAttributes
    }
