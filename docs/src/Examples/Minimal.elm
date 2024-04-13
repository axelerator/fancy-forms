module Examples.Minimal exposing (..)

import FancyForms.Form as Form exposing (Form, field)
import FancyForms.FormState exposing (FormState, alwaysValid)
import FancyForms.Widgets.Int exposing (integerInput)
import Html exposing (div, p, text)
import String exposing (fromInt)
import FancyForms.Form exposing (validate)
import FancyForms.Widgets.Int exposing (greaterThan)


type alias Model =
    { formState : FormState }

type Msg
    = ForForm Form.Msg

myForm : Form Int ()
myForm =
    Form.form
        (\errors_ html -> html) -- omitting errors for brevity
        alwaysValid -- no custom validations
         "minimal-example" -- unique id to be used in DOM
        (\amount ->
            { view = \formState _ -> amount.view formState
            , combine = \formState -> amount.value formState
            }
        )
        |> field identity (integerInput [] |> validate [greaterThan 0])

view model =
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , p []
            [ text "The user entered: "
            , text <| fromInt <| Form.extract myForm model.formState
            ]
        ]

init =
    { formState = Form.init myForm 42 }

update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }
