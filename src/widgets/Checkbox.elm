module Widgets.Checkbox exposing (widget)

import Form exposing (Msg, Widget)
import Html exposing (input)
import Html.Events exposing (onInput)
import Json.Decode as D 
import Json.Encode as E
import Html exposing (Attribute)
import Html.Attributes exposing (id)
import Html.Attributes exposing (checked)
import Html.Attributes exposing (type_)


type alias Msg =
    ()


widget : List (Attribute Msg) -> Widget Bool Msg Bool
widget attrs =
    { init = False
    , value = identity
    , view =
        \domId model ->
            input (attrs ++ [id domId, type_ "checkbox", onInput (\_-> ()) , checked model ]) []
    , update = \_ model -> not model
    , encodeMsg = \_ -> E.object []
    , decoderMsg = D.succeed ()
    , encodeModel = E.bool
    , decoderModel = D.bool
    }

