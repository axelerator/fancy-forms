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
        (\errors_ html -> html) -- omitting errors for brevity
        (\contact ->
            { view = \formState _ -> contact.view formState
            , combine = \formState -> contact.value formState
            }
        )
        |> fieldWithVariants dropdown
            ( "email", emailForm )
            [ ( "phone", phoneForm ) ]
            fromForm

fromForm : Contact -> (String, Contact)
fromForm c =
    let
      tf =  case c of
            Email _ -> ("email", c)
            Phone _ _ -> ("phone", c)
    in
        Debug.log "tf" tf

emailForm : Form Contact ()
emailForm =
    Form.form "email-form"
        alwaysValid -- no custom validations
        (\errors_ html -> html) -- omitting errors for brevity
        (\email ->
            { view = \formState _ -> email.view formState
            , combine = \formState -> Email <| email.value formState
            }
        )
        |> field email_ (textInput [])

email_ : Contact -> String
email_ c =
    case c of
        Email email -> email
        Phone _ _ -> ""


phoneForm : Form Contact ()
phoneForm =
    Form.form "email-form"
        alwaysValid -- no custom validations
        (\errors_ html -> html) -- omitting errors for brevity
        (\countryCode number ->
            { view =
                \formState _ ->
                    [ div [ class "grid" ]
                        [ div [] <| countryCode.view formState
                        , div [] <| number.view formState
                        ]
                    ]
            , combine = \formState -> Phone (countryCode.value formState) (number.value formState)
            }
        )
        |> field countryCode_ (integerInput [])
        |> field number_ (integerInput [])

countryCode_ : Contact -> Int
countryCode_ c =
    case c of
        Email _ -> 0
        Phone cc _ -> cc

number_ : Contact -> Int
number_ c =
    case c of
        Email _ -> 0
        Phone _ n -> n

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

default =
    Phone 1 42234711

init =
    { formState = Form.init myForm (Just default) }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }
