module Examples.Code.Variants exposing (code)

code ="""
module Examples.Variants exposing (..)

import FancyForms.Form as Form exposing (Form, field, fieldWithVariants, toWidget)
import FancyForms.FormState exposing (FormState, alwaysValid)
import FancyForms.Widgets.Dropdown exposing (dropdown)
import FancyForms.Widgets.Int exposing (integerInput)
import FancyForms.Widgets.Text exposing (textInput)
import Html exposing (div, p, text)
import Html.Attributes exposing (class)
import String exposing (fromInt)


type alias Model =
    { formState : FormState }


type Msg
    = ForForm Form.Msg


type Contact
    = Email String
    | Phone Int Int

myForm : Form Contact ()
myForm =
    Form.form "variant-example"
        alwaysValid -- no custom validations
        (\\errors_ html -> html) -- omitting errors for brevity
        (\\contact ->
            { view = \\formState _ -> contact.view formState
            , combine = \\formState -> contact.value formState
            }
        )
        |> fieldWithVariants dropdown
            ( "email", emailForm )
            [ ( "phone", phoneForm ) ]

emailForm : Form Contact ()
emailForm =
    Form.form "email-form"
        alwaysValid -- no custom validations
        (\\errors_ html -> html) -- omitting errors for brevity
        (\\email ->
            { view = \\formState _ -> email.view formState
            , combine = \\formState -> Email <| email.value formState
            }
        )
        |> field (textInput [])


phoneForm : Form Contact ()
phoneForm =
    Form.form "email-form"
        alwaysValid -- no custom validations
        (\\errors_ html -> html) -- omitting errors for brevity
        (\\countryCode number ->
            { view =
                \\formState _ ->
                    [ div [ class "grid" ]
                        [ div [] <| countryCode.view formState
                        , div [] <| number.view formState
                        ]
                    ]
            , combine = \\formState -> Phone (countryCode.value formState) (number.value formState)
            }
        )
        |> field (integerInput [])
        |> field (integerInput [])



view model =
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , p []
            [ text "The user entered: "
            , case Form.extract myForm model.formState of
                Email email ->
                    text <| "Email: " ++ email

                Phone countryCode number ->
                    text <| "Phone: " ++ fromInt countryCode ++ " " ++ fromInt number
            ]
        ]


init =
    { formState = Form.init myForm }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }
"""
