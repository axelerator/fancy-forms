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


type alias Msg =
    String


type alias Model =
    String


{-| Returns a widget that lets the user select a value from a list of
    variants.
-}
dropdown : Variants a -> Widget String Msg a customError
dropdown (( default, _ ) as variants) =
    { init = default.id
    , value = fromString variants
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
        selected =
            fromString variants selectedId

        opt { id, label, value } =
            option [ Html.Attributes.value id, checked <| selected == value ] [ text label ]
    in
    [ select
        [ class "dropdown", onInput identity ]
        (List.map opt (all variants))
    ]
