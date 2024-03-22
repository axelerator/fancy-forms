module Widgets.Dropdown exposing (Variant, Variants, dropdown)

import Form exposing (DomId, Error(..), Msg, Widget, alwaysValid)
import Html exposing (Html, a, option, select, text)
import Html.Attributes exposing (checked, class, id, value)
import Html.Events exposing (onInput)
import Json.Decode as D
import Json.Encode as E
import Maybe exposing (withDefault)


type alias Msg =
    String


type alias Model =
    String


type alias Variant a =
    { value : a
    , id : String
    , label : String
    }


type alias Variants a =
    ( Variant a, List (Variant a) )


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


update : Msg -> Model -> Model
update id _ =
    id


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
      <|
        List.map opt (all variants)
    ]



