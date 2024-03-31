module Examples.Combination exposing (..)

import FancyForms.Form as Form exposing (Form, field)
import FancyForms.FormState exposing (FormState, Widget, alwaysValid)
import FancyForms.Widgets.Text exposing (textInput)
import Html exposing (div, p, text)
import Html.Attributes exposing (type_)
import Html exposing (label)
import Html.Attributes exposing (for)
import Examples.Decoration exposing (Login)
import Examples.Validation exposing (Date)
import Examples.Decoration exposing (withLabel)
import Examples.Validation exposing (MyError)
import Html exposing (hr)
import String exposing (fromInt)
import Html exposing (br)
import FancyForms.Form exposing (default)


type alias Model =
    { formState : FormState }


type Msg
    = ForForm Form.Msg


type alias Signup =
    { login: Login
    , birthday : Date
    }

loginInput = Form.toWidget Examples.Decoration.myForm
dateInput = Form.toWidget Examples.Validation.myForm

myForm : Form Signup MyError
myForm =
    Form.form "combination-example"
        alwaysValid -- no custom validations
        (\errors_ html -> html) -- omitting errors for brevity
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
        |> field (default emptyLogin) loginInput
        |> field (default defaultDate) (dateInput |> withLabel "birthday")


view model =
    let
      data = Form.extract myForm model.formState
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
            [ text "day: ", text <| fromInt data.birthday.day 
            , text " month: ", text <| fromInt data.birthday.month
            , text " year: ", text <| fromInt data.birthday.year
            ]
        ]


init =
    { formState = Form.init myForm (Just formDefaults) }

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

