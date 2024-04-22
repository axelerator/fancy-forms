module Examples.Variants exposing (..)

import FancyForms.Form as Form exposing (Form, field, fieldWithVariants)
import FancyForms.FormState exposing (FormState, alwaysValid)
import FancyForms.Widgets.Dropdown exposing (dropdown)
import FancyForms.Widgets.RadioButtons exposing (radioButtons)
import FancyForms.Widgets.Int exposing (integerInput)
import FancyForms.Widgets.Text exposing (textInput)
import Html exposing (div, p, text)
import Html.Attributes exposing (class)
import String exposing (fromInt)


type alias Model =
    { formState : FormState 
    , useRadioButtons : Bool
    }


type Msg
    = ForForm Form.Msg
    | ToggleSwitcher


type Contact
    = Email String
    | Phone Int Int


myForm : Bool -> Form Contact ()
myForm useRadioButtons =
    Form.form 
        (\errors_ html -> html) -- omitting errors for brevity
        alwaysValid -- no custom validations
        "variant-example"
        (\contact ->
            { view = \formState _ -> contact.view formState
            , combine = \formState -> contact.value formState
            }
        )
        |> fieldWithVariants 
            identity
            (if useRadioButtons then radioButtons else dropdown)
            ( "email", emailForm )
            [ ( "phone", phoneForm ) ]
            variantToString


variantToString : Contact -> String
variantToString c =
    case c of
        Email _ ->
            "email"

        Phone _ _ ->
            "phone"


emailForm : Form Contact ()
emailForm =
    Form.form
        (\errors_ html -> html) -- omitting errors for brevity
        alwaysValid -- no custom validations
         "email-form"
        (\email ->
            { view = \formState _ -> email.view formState
            , combine = \formState -> Email <| email.value formState
            }
        )
        |> field email_ (textInput [])


email_ : Contact -> String
email_ c =
    case c of
        Email email ->
            email

        Phone _ _ ->
            ""


phoneForm : Form Contact ()
phoneForm =
    Form.form
        (\errors_ html -> html) -- omitting errors for brevity
        alwaysValid -- no custom validations
        "email-form"
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
        Email _ ->
            0

        Phone cc _ ->
            cc


number_ : Contact -> Int
number_ c =
    case c of
        Email _ ->
            0

        Phone _ n ->
            n


view {formState, useRadioButtons} =
    div []
        [ div [] <| Form.render ForForm (myForm useRadioButtons) formState
        , p []
            [ text "The user entered: "
            , case Form.extract (myForm False) formState of
                Email email ->
                    text <| "Email: " ++ email

                Phone countryCode number ->
                    text <| "Phone: " ++ fromInt countryCode ++ " " ++ fromInt number
            ]
        ]


default =
    Phone 1 1234


init =
    { formState = Form.init (myForm False) default 
    , useRadioButtons = False
    }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update (myForm False) formMsg model.formState }
        ToggleSwitcher ->
            { model | useRadioButtons = not model.useRadioButtons }
