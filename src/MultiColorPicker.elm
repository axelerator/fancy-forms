module MultiColorPicker exposing (widget)

import Form exposing (DomId, Widget)
import Html exposing (Html, button, div, input, s, span, text)
import Html.Attributes exposing (style, value)
import Html.Events exposing (onClick, onInput)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import String exposing (toLower)
import WebColor exposing (WebColor, asStr)
import Form exposing (alwaysValid)


widget : Widget Model Msg (List WebColor) customError
widget =
    { init = init
    , value = .selected
    , validate = alwaysValid
    , view = view
    , update = update
    , encodeMsg = encodeMsg
    , decoderMsg = decoderMsg
    , encodeModel = encodeModel
    , decoderModel = decoderModel
    }


type Msg
    = ChangePrefix String
    | Remove WebColor
    | Pick WebColor


encodeMsg : Msg -> Value
encodeMsg msg =
    let
        ( kind, v ) =
            case msg of
                ChangePrefix s ->
                    ( "ChangePrefix", E.string s )

                Remove color ->
                    ( "Remove", WebColor.encodeColor color )

                Pick color ->
                    ( "Pick", WebColor.encodeColor color )
    in
    E.object [ ( "kind", E.string kind ), ( "value", v ) ]


decoderMsg : Decoder Msg
decoderMsg =
    D.field "kind" D.string
        |> D.andThen
            (\kind ->
                case kind of
                    "ChangePrefix" ->
                        D.field "value" D.string
                            |> D.map ChangePrefix

                    "Remove" ->
                        D.field "value" WebColor.decoderColor
                            |> D.map Remove

                    "Pick" ->
                        D.field "value" WebColor.decoderColor
                            |> D.map Pick

                    _ ->
                        D.fail "unknown kind"
            )


type alias Model =
    { prefix : String
    , selected : List WebColor
    }


encodeModel : Model -> Value
encodeModel { prefix, selected } =
    E.object
        [ ( "prefix", E.string prefix )
        , ( "selected", E.list WebColor.encodeColor selected )
        ]


decoderModel : Decoder Model
decoderModel =
    D.map2 Model
        (D.field "prefix" D.string)
        (D.field "selected" (D.list WebColor.decoderColor))


init : Model
init =
    { prefix = ""
    , selected = []
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ChangePrefix s ->
            { model | prefix = s }

        Remove color ->
            { model | selected = List.filter ((/=) color) model.selected }

        Pick color ->
            { model
                | selected = model.selected ++ [ color ]
                , prefix = ""
            }


view : DomId -> Model -> Html Msg
view _ { prefix, selected } =
    div []
        (input [ value prefix, onInput ChangePrefix ] []
            :: (viewOptions prefix ++ List.map viewSelectedColor selected)
        )


viewOptions : String -> List (Html Msg)
viewOptions prefix =
    if String.isEmpty prefix then
        []

    else
        List.filter (\c -> String.startsWith (toLower prefix) (toLower <| asStr c)) WebColor.all
            |> List.map
                (\color ->
                    button
                        [ onClick (Pick color) ]
                        [ text (asStr color) ]
                )


viewSelectedColor : WebColor -> Html Msg
viewSelectedColor color =
    span
        [ style "color" (asStr color)
        , onClick (Remove color)
        ]
        [ text (asStr color) ]
