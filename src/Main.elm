module Main exposing (main)

import Browser
import Form exposing (Error, Form, FormState, Widget, toWidget)
import Html exposing (Html, article, button, div, footer, label, text)
import Html.Attributes exposing (class, for, style)
import Html.Events exposing (onClick)
import Maybe exposing (withDefault)
import MultiColorPicker
import String exposing (fromInt)
import WebColor exposing (WebColor, asStr)
import Widgets.Checkbox
import Widgets.Int
import Widgets.Text


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
            --( { model | formState = Form.updateField myForm fieldId value model.formState }
            ( model
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
            --[ Html.map ForForm <| myForm.fn.view model.formState
            [ footer []
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


minimal : Form String
minimal =
    Form.form
        (\field ->
            { view = \formState -> field.view formState
            , combine = \formState -> ( field.value formState, Form.alwaysValid )
            }
        )
        |> Form.field (Widgets.Text.widget [])



{-
   viewError : Error -> Html msg
   viewError error =
       div [] [ text <| errorToString error ]

   errorToString : Error -> String
   errorToString e =
       case e of
           Form.MustNotBeBlank -> "Must not be blank"
   myForm : Form MyFormData
   myForm =
       Form.form
           (\int check wc name ->
               { view =
                   \formState ->
                       div [ class "grid" ]
                           [ div [] <| List.map viewError (Form.errors myForm formState)
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
                       , (\(FormData {counter, webColors}) ->
                           if counter /= List.length webColors then
                               [Form.MustNotBeBlank]
                           else
                               []
                          )
                       )
               }
           )
           |> Form.field (Widgets.Int.widget [])
           |> Form.field (withLabel "checkbox" <| Widgets.Checkbox.widget [])
           |> Form.field (withLabel "Web Colors" <| MultiColorPicker.widget)
           |> Form.field (withLabel "name" <| fullnameWidget)


   validateFullName : Fullname -> List Error
   validateFullName { first } =
       if Debug.log "first" first == "" then [Form.MustNotBeBlank] else []

   nameForm : Form Fullname
   nameForm =
       Form.form
           (\first last ->
               { view =
                   \formState ->
                       div []
                           [ div [] <| List.map viewError (Form.errors myForm formState)
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

-}


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
