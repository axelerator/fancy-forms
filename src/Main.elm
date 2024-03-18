module Main exposing (main)

import Browser
import Form exposing (Form, FormState, Widget, toWidget)
import Html exposing (Html, article, button, div, footer, label, text)
import Html.Attributes exposing (class, for, style)
import Html.Events exposing (onClick)
import MultiColorPicker
import String exposing (fromInt)
import WebColor exposing (WebColor, asStr)
import Widgets.Checkbox
import Widgets.Int
import Widgets.Text
import Maybe exposing (withDefault)


type alias Model =
    { formState : Form.FormState
    , submitted : Maybe MyFormData
    }


type Msg
    = ForForm Form.Msg
    | Submit MyFormData


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = \_ -> Sub.none
        , view = view
        }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { formState = Form.init
      , submitted = Nothing
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ForForm (Form.FormMsg fieldId value) ->
            ( { model | formState = Form.updateField myForm fieldId value model.formState }
            , Cmd.none
            )

        Submit formData ->
            ( { model | submitted = Just formData }
            , Cmd.none
            )


view : Model -> Html Msg
view model =
    div []
        [ article []
            [ Html.map ForForm <| myForm.fn.view model.formState
            , footer []
                [ button [ onClick (Submit <| Form.extract myForm model.formState) ] [ text "Submit" ] ]
            ]
        , model.submitted 
            |> Maybe.map displayFormData 
            |> withDefault (text "")
        ]


type MyFormData
    = FormData
        { counter : Int
        , webColors : List WebColor
        , check : Bool
        , name : Fullname
        }


myForm : Form MyFormData
myForm =
    Form.form
        (\int check wc name ->
            { view =
                \formState ->
                    div [ class "grid" ]
                        [ div [] [ int.view formState ]
                        , div [] [ check.view formState ]
                        , div [] [ wc.view formState ]
                        , div [] [ name.view formState ]
                        ]
            , combine =
                \formState ->
                    FormData
                        { counter = int.value formState
                        , webColors = wc.value formState
                        , check = check.value formState
                        , name = name.value formState
                        }
            }
        )
        |> Form.field (Widgets.Int.widget [])
        |> Form.field (withLabel "checkbox" <| Widgets.Checkbox.widget [])
        |> Form.field (withLabel "Web Colors" <| MultiColorPicker.widget)
        |> Form.field (withLabel "name" <| fullnameWidget)


type alias Fullname =
    { first : String
    , last : String
    }


nameForm : Form Fullname
nameForm =
    Form.form
        (\first last ->
            { view =
                \formState ->
                    div [ class "grid" ]
                        [ div [] [ first.view formState ]
                        , div [] [ last.view formState ]
                        ]
            , combine =
                \formState ->
                    { first = first.value formState
                    , last = last.value formState
                    }
            }
        )
        |> Form.field (withLabel "first name" <| Widgets.Text.widget [])
        |> Form.field (withLabel "last name" <| Widgets.Text.widget [])


fullnameWidget : Widget FormState Form.Msg Fullname
fullnameWidget =
    toWidget nameForm


withLabel : String -> Widget widgetModel msg value -> Widget widgetModel msg value
withLabel labelText wrapped =
    (\domId content ->
        div
            [ style "border" "1px solid red" ]
            [ label [ for domId ] [ text labelText ]
            , content
            ]
    )
        |> Form.wrap wrapped


displayFormData : MyFormData -> Html Msg
displayFormData (FormData formData) =
    div []
        [ div [] <| [ text "counter: ", text (fromInt formData.counter) ]
        , div [] <|
            [ text "check: "
            , text <|
                if formData.check then
                    "true"

                else
                    "false"
            ]
        , div [] <| text "web colors: " :: List.map (\c -> text (asStr c)) formData.webColors
        , div [] <| [ text "name: ", text formData.name.first, text " ", text formData.name.last ]
        ]
