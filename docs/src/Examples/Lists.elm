module Examples.Lists exposing (..)

import FancyForms.Form as Form exposing (Form, listField)
import FancyForms.FormState exposing (FormState, alwaysValid)
import FancyForms.Widgets.Text exposing (textInput)
import Html exposing (Attribute, button, div, fieldset, p, text)
import Html.Attributes exposing (attribute)
import Html.Events exposing (onClick)


type alias Model =
    { formState : FormState }


type Msg
    = ForForm Form.Msg


myForm : Form (List String) ()
myForm =
    Form.form
        (\_ html -> html) -- omitting errors for brevity
        alwaysValid -- no custom validations
        "lists-example"
        (\todos ->
            { view = \formState _ -> todos.view formState
            , combine = \formState -> todos.value formState
            }
        )
        |> listField
            listWithAddButton
            fieldWithRemoveButton
            "a new todo"
            identity
            (textInput [])

fieldWithRemoveButton removeMsg input =
    [ fieldset [ role "group" ] <|
        input
            ++ [ button [ onClick removeMsg ] [ text "Remove" ] ]
    ]

listWithAddButton addMsg items =
    [ div [] <|
        items
            ++ [ button [ onClick addMsg ] [ text "Add todo" ] ]
    ]

view model =
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , p []
            (text "The user entered: "
                :: (List.map (\todo -> div [] [ text todo ]) <| Form.extract myForm model.formState)
            )
        ]


init =
    { formState = Form.init myForm [ "yay!" ] }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }


role : String -> Attribute msg
role value =
    attribute "role" value
