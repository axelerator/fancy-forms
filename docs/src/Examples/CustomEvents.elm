module Examples.CustomEvents exposing (..)

import FancyForms.Form as Form exposing (Form, field, getCustomEvent)
import FancyForms.FormState exposing (FormState, alwaysValid)
import FancyForms.Widgets.Int exposing (integerInput)
import Html exposing (div, p, text)
import String exposing (fromInt)
import FancyForms.Form exposing (validate)
import FancyForms.Widgets.Int exposing (greaterThan)
import Html exposing (hr)
import Html exposing (button)
import Html.Events exposing (onClick)
import FancyForms.Form exposing (customEvent)
import Json.Encode
import Json.Decode


type alias Model =
    { formState : FormState
    , count : Int
    }

type Msg
    = ForForm Form.Msg

myForm : Form Int ()
myForm =
    Form.form
        (\errors_ html -> html) -- omitting errors for brevity
        alwaysValid -- no custom validations
         "minimal-example" -- unique id to be used in DOM
        (\amount ->
            { view = \formState _ -> 
                amount.view formState
                |> (++) doubleValues
            , combine = \formState -> amount.value formState
            }
        )
        |> field identity (integerInput [] |> validate [greaterThan 0])

doubleValues = 
    [ hr [] []
    , button 
        [ onClick <| customEvent <| Json.Encode.int 2 ] 
        [ text "Multiply"]
    ]

view model =
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , p []
            [ text "The user entered: "
            , text <| fromInt <| Form.extract myForm model.formState
            ]
        , p [] 
            [ text "The number of custom events is: "
            , text <| fromInt model.count
            ]
        ]

init =
    { formState = Form.init myForm 42
    , count = 0
    }

multiply : Int -> FormState -> FormState
multiply n formState =
    Form.extract myForm formState 
    |> (\i -> i * n)
    |> Form.init myForm

update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            case getCustomEvent formMsg |> Maybe.map (Json.Decode.decodeValue Json.Decode.int) of
                Just (Ok n) -> 
                    { model 
                    | count = model.count + 1 
                    , formState = multiply n model.formState
                    }
                _ -> 
                    { model | formState = Form.update myForm formMsg model.formState }
