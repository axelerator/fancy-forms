module Main exposing (main)

import Browser
import Form exposing (Error(..), FieldWithErrors, Form, FormState, Widget, alwaysValid, extract, field, listField, toWidget, validate)
import Html exposing (Html, article, button, div, footer, label, text)
import Html.Attributes exposing (class, classList, for)
import Html.Events exposing (onClick)
import Maybe exposing (withDefault)
import MultiColorPicker
import String exposing (fromInt)
import WebColor exposing (WebColor, asStr)
import Widgets.Checkbox exposing (checkbox)
import Widgets.Int exposing (integerInput)
import Widgets.Text exposing (notBlank, textInput)
import Json.Encode as E
import Form exposing (debugFormState)
import Html exposing (a)
import Html.Attributes exposing (attribute)
import Form exposing (FieldWithRemoveButton)
import Form exposing (ListWithAddButton)


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
    ( { formState = Form.init currentForm
      , submitted = Nothing
      }
    , Cmd.none
    )

currentForm = hasManyNamesForm

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ForForm formMsg ->
            ( { model | formState = Form.update currentForm formMsg (debugFormState model.formState) }
            , Cmd.none
            )

        Submit formData ->
            ( { model | submitted = Just formData }
            , Cmd.none
            )


styles : Html Msg
styles =
    """
    .has-error > input { border-color: red; }
    .errors { color: red; }
    """
        |> text
        |> List.singleton
        |> Html.node "style" []


view : Model -> Html Msg
view model =
    div []
        [ styles
        , article [] <|
            Form.render ForForm currentForm model.formState
                ++ [ footer [] [ button [ onClick <| Submit <| extract myForm model.formState ] [ text "Submit" ] ]
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
        , ints : List Int
        }


type alias Fullname =
    { first : String
    , last : String
    }


fieldWithErrors : FieldWithErrors MyError
fieldWithErrors errors html =
    [ div
        (if List.isEmpty errors then
            []

         else
            [ class "has-error" ]
        )
        (html ++ [ viewErrors errors ])
    ]


viewErrors : List (Error MyError) -> Html msg
viewErrors errors =
    if List.isEmpty errors then
        text ""

    else
        div [ class "errors" ] [ text <| String.join " " <| List.map errorToString errors ]


errorToString : Error MyError -> String
errorToString e =
    case e of
        Form.MustNotBeBlank ->
            "must not be blank"

        Form.CustomError myError ->
            case myError of
                FirstNameMustNotBeSameAsLastName ->
                    "first name must not be the same as last name"

                SelectedColorMustMatchCounter ->
                    "amount of color must match counter"


type MyError
    = FirstNameMustNotBeSameAsLastName
    | SelectedColorMustMatchCounter


validateFullName : Fullname -> List (Error MyError)
validateFullName { first, last } =
    if first == last then
        [ CustomError FirstNameMustNotBeSameAsLastName ]

    else
        []


nameForm : Form Fullname MyError
nameForm =
    Form.form
        validateFullName
        fieldWithErrors
        (\first last ->
            { view =
                \formState errors ->
                        [ div [] <| first.view formState
                        , div [] <| last.view formState
                        , div [] <| [ viewErrors errors ]
                        ]
            , combine =
                \formState ->
                    { first = first.value formState
                    , last = last.value formState
                    }
            }
        )
        |> field
            (textInput []
                |> withLabel "first name"
                |> validate [ notBlank ]
            )
        |> field
            (textInput []
                |> withLabel "last name"
                |> validate [ notBlank ]
            )


fullnameWidget : Widget FormState Form.Msg Fullname MyError
fullnameWidget =
    toWidget nameForm


withLabel : String -> Widget widgetModel msg value customError -> Widget widgetModel msg value customError
withLabel labelText wrapped =
    (\domId content ->
        label [ for domId ] [ text labelText ]
            :: content
    )
        |> Form.wrap wrapped


validateFormData : MyFormData -> List (Error MyError)
validateFormData (FormData { counter, webColors }) =
    if counter /= List.length webColors then
        [ Form.CustomError SelectedColorMustMatchCounter ]

    else
        []


type alias HasMany =
    List String


hasManyForm : Form HasMany ()
hasManyForm =
    Form.form
        alwaysValid
        (\_ html -> html)
        (\ints ->
            { view = \formState _ -> ints.view formState
            , combine = \formState -> ints.value formState
            }
        )
        |> listField (withAddButton "item" ) withRemoveButton (textInput [])


type alias HasManyNames =
    List Fullname


hasManyNamesForm : Form HasManyNames MyError
hasManyNamesForm =
    Form.form
        alwaysValid
        (\_ html -> html)
        (\names ->
            { view = \formState _ -> names.view formState
            , combine = \formState -> names.value formState
            }
        )
        |> listField (withAddButton "person") withRemoveButton (fullnameWidget)

withRemoveButton : FieldWithRemoveButton msg
withRemoveButton remove inputHtml =
    [ div [class "grid"]
        (inputHtml ++ [button [onClick remove, class "secondary"] [text "Remove"]] )
    ]

withAddButton : String -> ListWithAddButton msg
withAddButton subject add inputHtml =
    inputHtml ++
        [button [onClick add, class "secondary"] [text <| "Add " ++ subject]] 
    

role : String -> Html.Attribute msg 
role r = ( attribute "role" r )

myForm : Form MyFormData MyError
myForm =
    Form.form
        validateFormData
        (\_ html -> html)
        (\int check wc name ints ->
            { view =
                \formState errors ->
                    [ div [ classList [ ( "has-error", List.isEmpty errors ) ] ]
                        [ div [ class "errors" ] <| [ viewErrors errors ]
                        , div [ class "grid" ]
                            [ div [] (int.view formState)
                            , div [] (check.view formState)
                            , div [] (wc.view formState)
                            , div [] (name.view formState)
                            , div [] (ints.view formState)
                            ]
                        ]
                    ]
            , combine =
                \formState ->
                    FormData
                        { counter = int.value formState
                        , webColors = wc.value formState
                        , check = check.value formState
                        , name = name.value formState
                        , ints = ints.value formState
                        }
            }
        )
        |> field (integerInput [])
        |> field (checkbox |> withLabel "checkbox")
        |> field (MultiColorPicker.widget |> withLabel "Web Colors")
        |> field fullnameWidget
        |> listField (withAddButton "number") withRemoveButton (integerInput [])


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
        , div [] <| text "numbers: " :: List.map (\i -> text (fromInt i)) formData.ints
        ]
