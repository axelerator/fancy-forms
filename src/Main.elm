module Main exposing (main)

import Browser
import Form exposing (Error, Form, FormState, Widget, toWidget)
import Html exposing (Html, article, div, footer, label, text)
import Html.Attributes exposing (class, for)
import Maybe exposing (withDefault)
import MultiColorPicker
import String exposing (fromInt)
import WebColor exposing (WebColor, asStr)
import Widgets.Checkbox
import Widgets.Int
import Widgets.Text exposing (notBlank)


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


currentForm =
    myForm


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ForForm (Form.FormMsg fieldId value) ->
            ( { model | formState = Form.updateField currentForm fieldId value model.formState }
            , Cmd.none
            )

        Submit formData ->
            ( { model | submitted = Just formData }
            , Cmd.none
            )


styles : Html Msg
styles =
    """
    .has-error input { border-color: red; }
    .has-error .errors { color: red; }
    """
        |> text
        |> List.singleton
        |> Html.node "style" []


view : Model -> Html Msg
view model =
    div []
        [ styles
        , article []
            [ Form.render ForForm currentForm model.formState
            , footer []
                []

            --[ button [ onClick (Submit <| Form.extract myForm model.formState) ] [ text "Submit" ] ]
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


type alias Fullname =
    { first : String
    , last : String
    }


fieldWithErrors errors html =
    div
        (if List.isEmpty errors then
            []

         else
            [ class "has-error" ]
        )
        [ html
        , viewErrors errors
        ]


viewErrors : List Error -> Html msg
viewErrors errors =
    if List.isEmpty errors then
        text ""

    else
        div [ class "errors" ] [ text <| String.join " " <| List.map errorToString errors ]


errorToString : Error -> String
errorToString e =
    case e of
        Form.MustNotBeBlank ->
            "must not be blank"


validateFullName : Fullname -> List Error
validateFullName { first } =
    if Debug.log "first" first == "" then
        [ Form.MustNotBeBlank ]

    else
        []


nameForm : Form Fullname
nameForm =
    Form.form
        fieldWithErrors
        (\first last ->
            { view =
                \formState ->
                    div []
                        [ div [] <| [ viewErrors (Form.errors myForm formState) ]
                        , div [ class "grid" ]
                            [ div [] [ first.view formState ]
                            , div [] [ last.view formState ]
                            ]
                        ]
            , combine =
                \formState ->
                    ( { first = first.value formState
                      , last = last.value formState
                      }
                    , validateFullName
                    )
            }
        )
        |> Form.field (withLabel "first name" <| Widgets.Text.widget [] [ notBlank ])
        |> Form.field (withLabel "last name" <| Widgets.Text.widget [] [ notBlank ])


fullnameWidget : Widget FormState Form.Msg Fullname
fullnameWidget =
    toWidget nameForm


withLabel : String -> Widget widgetModel msg value -> Widget widgetModel msg value
withLabel labelText wrapped =
    (\domId content ->
        div
            []
            [ label [ for domId ] [ text labelText ]
            , content
            ]
    )
        |> Form.wrap wrapped


myForm : Form MyFormData
myForm =
    Form.form
        (\_ html -> html)
        (\int check wc name ->
            { view =
                \formState ->
                    div [ class "grid" ]
                        [ div [] <| [ viewErrors (Form.errors myForm formState) ]
                        , div [] [ int.view formState ]
                        , div [] [ check.view formState ]
                        , div [] [ wc.view formState ]
                        , div [] [ name.view formState ]
                        ]
            , combine =
                \formState ->
                    ( FormData
                        { counter = int.value formState
                        , webColors = wc.value formState
                        , check = check.value formState
                        , name = name.value formState
                        }
                    , \(FormData { counter, webColors }) ->
                        if counter /= List.length webColors then
                            [ Form.MustNotBeBlank ]

                        else
                            []
                    )
            }
        )
        |> Form.field (Widgets.Int.widget [])
        |> Form.field (withLabel "checkbox" <| Widgets.Checkbox.widget [])
        |> Form.field (withLabel "Web Colors" <| MultiColorPicker.widget)
        |> Form.field fullnameWidget


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
