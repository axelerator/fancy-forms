module Main exposing (main)

import Browser
import FancyForms.Form as Form exposing (FieldWithErrors, Form, Variants, extract, field, fieldWithVariants, toWidget, validate)
import FancyForms.FormState as FormState exposing (Error(..), FormState, Widget, alwaysValid)
import Html exposing (Html, article, button, div, footer, label, text)
import Html.Attributes exposing (class, classList, for)
import Html.Events exposing (onClick)
import FancyForms.Widgets.Dropdown exposing (dropdown)
import FancyForms.Widgets.Int exposing (greaterThan, integerInput)
import FancyForms.Widgets.Text exposing (notBlank, textInput)


type alias Model =
    { formState : FormState
    }


type Msg
    = ForForm Form.Msg
    | Submit Ingredient


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , update = update
        , subscriptions = \_ -> Sub.none
        , view = view
        }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { formState = Form.init currentForm
      }
    , Cmd.none
    )


currentForm : Form Ingredient MyError
currentForm =
    ingredientForm


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ForForm formMsg ->
            ( { model | formState = Form.update currentForm formMsg model.formState }
            , Cmd.none
            )

        Submit formData ->
            let
                _ =
                    Debug.log "submitted form" formData
            in
            ( { model
                | formState = currentForm.blur model.formState
              }
            , Cmd.none
            )


styles : Html Msg
styles =
    """
    .has-error > input { border-color: red; }
    .errors { color: red; }
    """
        |> text
        |> List.singleton
        |> Html.node "style" []


view : Model -> Html Msg
view model =
    Html.main_ []
        [ styles
        , article [] <|
            Form.render ForForm currentForm model.formState
                ++ [ footer [] [ button [ onClick <| Submit <| extract currentForm model.formState ] [ text "Submit" ] ]
                   ]
        ]


fieldWithErrors : FieldWithErrors MyError
fieldWithErrors errors html =
    [ div
        (if List.isEmpty (Debug.log "errors:" errors) then
            []

         else
            [ class "has-error" ]
        )
        (html ++ [ viewErrors errors ])
    ]


viewErrors : List (Error MyError) -> Html msg
viewErrors errors =
    if List.isEmpty errors then
        text ""

    else
        div [ class "errors" ] [ text <| String.join " " <| List.map errorToString errors ]


errorToString : Error MyError -> String
errorToString e =
    case e of
        FormState.MustNotBeBlank ->
            "must not be blank"

        FormState.MustBeGreaterThan n ->
            "must be greater than " ++ String.fromInt n

        FormState.CustomError myError ->
            case myError of
                FirstNameMustNotBeSameAsLastName ->
                    "first name must not be the same as last name"

                SelectedColorMustMatchCounter ->
                    "amount of color must match counter"


type MyError
    = FirstNameMustNotBeSameAsLastName
    | SelectedColorMustMatchCounter


withLabel : String -> Widget widgetModel msg value customError -> Widget widgetModel msg value customError
withLabel labelText wrapped =
    (\domId content ->
        label [ for domId ] [ text labelText ]
            :: content
    )
        |> Form.wrap wrapped


type VolumeUnit
    = Milliliter
    | CentiLiter
    | Liter


volumeUnitVariants : Variants VolumeUnit
volumeUnitVariants =
    ( { value = Milliliter, id = "ml", label = "milliliter" }
    , [ { value = CentiLiter, id = "cl", label = "centiliter" }
      , { value = Liter, id = "l", label = "liter" }
      ]
    )


type alias LiquidIngredient =
    { name : String
    , amount : Int
    , unit : VolumeUnit
    }


liquidForm : Form Ingredient MyError
liquidForm =
    Form.form
        alwaysValid
        fieldWithErrors
        (\name amount unit ->
            { view =
                \formState errors ->
                    [ div [ classList [ ( "has-error", List.isEmpty errors ) ] ] <|
                        List.concat
                            [ [ div [ class "errors" ] <| [ viewErrors errors ] ]
                            , name.view formState
                            , amount.view formState
                            , unit.view formState
                            ]
                    ]
            , combine =
                \formState ->
                    Liquid
                        { name = name.value formState
                        , amount = amount.value formState
                        , unit = unit.value formState
                        }
            }
        )
        |> field (textInput [] |> withLabel "name" |> validate [ notBlank ])
        |> field (integerInput [] |> withLabel "amount" |> validate [ greaterThan 0 ])
        |> field (dropdown volumeUnitVariants |> withLabel "unit")


type alias WholeIngredient =
    { name : String
    , amount : Int
    }


type Ingredient
    = Liquid LiquidIngredient
    | Whole WholeIngredient


wholeForm : Form Ingredient MyError
wholeForm =
    Form.form
        alwaysValid
        (\_ html -> html)
        (\name amount ->
            { view =
                \formState _ ->
                    [ div [] <| name.view formState
                    , div [] <| amount.view formState
                    ]
            , combine =
                \formState ->
                    Whole
                        { name = name.value formState
                        , amount = amount.value formState
                        }
            }
        )
        |> field
            (textInput []
                |> withLabel "name"
                |> validate [ notBlank ]
            )
        |> field
            (integerInput []
                |> withLabel "amount name"
            )


ingredientForm : Form Ingredient MyError
ingredientForm =
    Form.form
        alwaysValid
        fieldWithErrors
        (\ingredient ->
            { view =
                \formState _ ->
                    List.concat
                        [ ingredient.view formState
                        ]
            , combine =
                \formState ->
                    ingredient.value formState
            }
        )
        |> fieldWithVariants dropdown
            ( "Liquid ingredient", liquidForm |> toWidget )
            [ ( "Whole ingredient", wholeForm |> toWidget ) ]
