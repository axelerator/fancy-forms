module Widgets.Dropdown exposing (dropdown)

import Form exposing (Msg, Variant, Variants)
import FormState exposing (DomId, Widget, alwaysValid)
import Html exposing (Html, option, select, text)
import Html.Attributes exposing (checked, class, id, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import FormState exposing (justChanged)
import FormState exposing (UpdateResult)


type alias Msg =
    String


type alias Model =
    String


dropdown : Variants a -> Widget String Msg a customError
dropdown (( default, _ ) as variants) =
    { init = default.id
    , value = fromString variants
    , validate = alwaysValid
    , view = view variants
    , update = update
    , encodeMsg = E.string
    , decoderMsg = D.string
    , encodeModel = E.string
    , decoderModel = D.string
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
        selected =
            fromString variants selectedId

        opt { id, label, value } =
            option [ Html.Attributes.value id, checked <| selected == value ] [ text label ]
    in
    [ select
        [ class "dropdown", onInput identity ]
        (List.map opt (all variants))
    ]
