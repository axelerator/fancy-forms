module FancyForms.Widgets.RadioButtons exposing (radioButtons)

{-| A widget that lets the user make a selection based on radio buttons

@docs radioButtons

-}

import FancyForms.Form exposing (Msg, Variant, Variants)
import FancyForms.FormState exposing (DomId, UpdateResult, alwaysValid, justChanged, noAttributes)
import FancyForms.Widgets.Dropdown exposing (SelectWidget)
import Html exposing (Html, input, text)
import Html.Attributes exposing (checked, id, type_, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import List.Nonempty
import Maybe


{-| Messages that can be sent to the radio buttons
-}
type alias Msg =
    String


type alias Model =
    String


init : Variants a -> a -> Model
init variants v =
    List.Nonempty.filter (\{ value } -> value == v) variants
        |> List.head
        |> Maybe.map .id
        |> Maybe.withDefault (List.Nonempty.head variants |> .id)


{-| Returns a widget that lets the user select a value from a list of
variants with radio buttons.
-}
radioButtons : Variants a -> SelectWidget a customError
radioButtons variants =
    { init = init variants
    , value = fromString variants
    , default = List.Nonempty.head variants |> .value
    , validate = alwaysValid
    , isConsistent = \_ -> True
    , view = view variants
    , update = update
    , encodeMsg = E.string
    , decoderMsg = D.string
    , encodeModel = E.string
    , decoderModel = D.string
    , blur = identity
    , innerAttributes = noAttributes
    }


update : Msg -> Model -> UpdateResult Model
update id _ =
    justChanged id


fromString : Variants a -> String -> a
fromString ( first, others ) s =
    List.filter (\{ id } -> s == id) (first :: others)
        |> List.head
        |> Maybe.map .value
        |> Maybe.withDefault first.value


all : Variants a -> List (Variant a)
all ( first, others ) =
    first :: others


view : Variants a -> DomId -> List (Html.Attribute Msg) -> Model -> List (Html Msg)
view variants _ innerAttrs selectedId =
    let
        selectedValue =
            fromString variants selectedId

        opt { id, label, value } =
            Html.label []
                [ input
                    ([ type_ "radio"
                     , Html.Attributes.value id
                     , checked <| selectedValue == value
                     , onInput (\_ -> id)
                     ]
                        ++ innerAttrs
                    )
                    []
                , text label
                ]
    in
    List.map opt (all variants)
