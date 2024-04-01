module FancyForms.Widgets.Dropdown exposing (dropdown)
{-| A dropdown widget.
@docs dropdown
-}
import FancyForms.Form exposing (Msg, Variant, Variants)
import FancyForms.FormState exposing (DomId, UpdateResult, Widget, alwaysValid, justChanged)
import Html exposing (Html, option, select, text)
import Html.Attributes exposing (checked, class, id, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import Maybe exposing (withDefault)
import List.Nonempty exposing (ListNonempty)
import Html.Attributes exposing (selected)


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
    variants.
-}
dropdown : Variants a -> Widget String Msg a customError
dropdown variants =
    { init = init variants
    , value = fromString variants
    , default = List.Nonempty.head variants |> .value
    , validate = alwaysValid
    , isConsistent = (\_ -> True)
    , view = view variants
    , update = update
    , encodeMsg = E.string
    , decoderMsg = D.string
    , encodeModel = E.string
    , decoderModel = D.string
    , blur = identity
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


view : Variants a -> DomId -> Model -> List (Html Msg)
view variants _ selectedId =
    let
        selectedValue =
            fromString variants selectedId

        opt { id, label, value } =
            option [ Html.Attributes.value id, selected <| selectedValue == value ] [ text label ]
    in
    [ select
        [ class "dropdown", onInput identity ]
        (List.map opt (all variants))
    ]
