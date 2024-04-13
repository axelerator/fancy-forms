module Examples.Combination exposing (..)

import Examples.Decoration exposing (Login, withLabel)
import Examples.Validation exposing (Date, MyError)
import FancyForms.Form as Form exposing (Form, field)
import FancyForms.FormState exposing (FormState, alwaysValid)
import Html exposing (br, div, p, text)
import String exposing (fromInt)


type alias Model =
    { formState : FormState }


type Msg
    = ForForm Form.Msg


type alias Signup =
    { login : Login
    , birthday : Date
    }


loginInput =
    Form.toWidget Examples.Decoration.myForm


dateInput =
    Form.toWidget Examples.Validation.myForm


myForm : Form Signup MyError
myForm =
    Form.form
        (\errors_ html -> html) -- omitting errors for brevity
        alwaysValid -- no custom validations
        "combination-example"
        (\login birthday ->
            { view =
                \formState _ ->
                    List.concat
                        [ login.view formState
                        , birthday.view formState
                        ]
            , combine =
                \formState ->
                    { login = login.value formState
                    , birthday = birthday.value formState
                    }
            }
        )
        |> field .login loginInput
        |> field .birthday (dateInput |> withLabel "birthday")


view model =
    let
        data =
            Form.extract myForm model.formState
    in
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , p []
            [ text "The user entered: "
            , br [] []
            , text "login: "
            , text <| data.login.username
            , text ":"
            , text <| data.login.password
            ]
        , p []
            [ text "day: "
            , text <| fromInt data.birthday.day
            , text " month: "
            , text <| fromInt data.birthday.month
            , text " year: "
            , text <| fromInt data.birthday.year
            ]
        ]


init =
    { formState = Form.init myForm formDefaults }


formDefaults =
    { login = emptyLogin
    , birthday = defaultDate
    }


emptyLogin =
    { username = ""
    , password = ""
    }


defaultDate =
    { day = 1
    , month = 1
    , year = 1970
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }
