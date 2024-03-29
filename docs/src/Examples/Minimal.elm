module Examples.Minimal exposing (..)

import FancyForms.Form as Form exposing (Form, field)
import FancyForms.FormState exposing (FormState, alwaysValid)
import FancyForms.Widgets.Int exposing (integerInput)
import Html exposing (div, p, text)
import String exposing (fromInt)


type alias Model =
    { formState : FormState }

type Msg
    = ForForm Form.Msg

myForm : Form Int ()
myForm =
    Form.form "minimal-example"
        alwaysValid -- no custom validations
        (\errors_ html -> html) -- omitting errors for brevity
        (\amount ->
            { view = \formState _ -> amount.view formState
            , combine = \formState -> amount.value formState
            }
        )
        |> field (integerInput [])

view model =
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , p []
            [ text "The user entered: "
            , text <| fromInt <| Form.extract myForm model.formState
            ]
        ]

init =
    { formState = Form.init myForm }

update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }
