module Examples.Decoration exposing (..)

import Examples.Validation exposing (MyError)
import FancyForms.Form as Form exposing (Form, field)
import FancyForms.FormState exposing (FormState, Widget, alwaysValid)
import FancyForms.Widgets.Text exposing (textInput)
import Html exposing (div, label, p, text)
import Html.Attributes exposing (for, type_)


type alias Model =
    { formState : FormState }


type Msg
    = ForForm Form.Msg


type alias Login =
    { username : String
    , password : String
    }


contentWithLabel labelText domId content =
    label [ for domId ] [ text labelText ] :: content


withLabel :
    String
    -> Widget widgetModel msg value customError
    -> Widget widgetModel msg value customError
withLabel labelText wrapped =
    Form.wrap wrapped <| contentWithLabel labelText


textInputWithLabel labelText =
    textInput [] |> withLabel labelText


myForm : Form Login MyError
myForm =
    Form.form
        (\errors_ html -> html) -- omitting errors for brevity
        alwaysValid -- no custom validations
        "decoration-example"
        (\user password ->
            { view =
                \formState _ ->
                    List.concat
                        [ user.view formState
                        , password.view formState
                        ]
            , combine =
                \formState ->
                    { username = user.value formState
                    , password = password.value formState
                    }
            }
        )
        |> field .username (textInputWithLabel "username")
        |> field .password (textInput [ type_ "password" ] |> withLabel "password")


view model =
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , p []
            [ text "The user entered: "
            , text <| .username <| Form.extract myForm model.formState
            , text ":"
            , text <| .password <| Form.extract myForm model.formState
            ]
        ]


init =
    { formState = Form.init myForm default }


default =
    { username = ""
    , password = ""
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }
