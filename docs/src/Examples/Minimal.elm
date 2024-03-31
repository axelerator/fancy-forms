module Examples.Minimal exposing (..)

import FancyForms.Form as Form exposing (Form, field)
import FancyForms.FormState exposing (FormState, alwaysValid)
import FancyForms.Widgets.Int exposing (integerInput)
import Html exposing (div, p, text, br)
import String exposing (fromInt)
import FancyForms.Form exposing (validate)
import FancyForms.Widgets.Int exposing (greaterThan)
import FancyForms.Form exposing (default)


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
        |> field (default 42) (integerInput [] |> validate [greaterThan 0])

view model =
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , p []
            [ text "The user entered: "
            , text <| fromInt <| Form.extract myForm model.formState
            , br [] []
            , text "consistent: "
            , text <| if Form.isConsistentTmp myForm model.formState then "yes" else "no"
            ]
        ]

init =
    { formState = Form.init myForm Nothing }

update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }
