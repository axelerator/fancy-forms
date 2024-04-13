module FancyForms.Widgets.Dropdown exposing (dropdown, SelectWidget)

{-| A dropdown widget.

@docs dropdown, SelectWidget

-}

import FancyForms.Form exposing (Msg, Variant, Variants)
import FancyForms.FormState exposing (DomId, UpdateResult, Widget, alwaysValid, justChanged, noAttributes)
import Html exposing (Html, option, select, text)
import Html.Attributes exposing (class, id, selected, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import List.Nonempty
import Maybe


{-| Messages that can be sent to the dropdown.
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


{-| Signature for a widget that lets the user select a value from a
list of variants.
-}
type alias SelectWidget a customError =
    Widget String Msg a customError


{-| Returns a widget that lets the user select a value from a list of
variants.
-}
dropdown : Variants a -> SelectWidget a customError
dropdown variants =
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
            option [ Html.Attributes.value id, selected <| selectedValue == value ] [ text label ]
    in
    [ select
        ([ class "dropdown", onInput identity ] ++ innerAttrs)
        (List.map opt (all variants))
    ]
