module Main exposing (main)

import Browser
import Examples.Code.Combination as Combination
import Examples.Code.Decoration as Decoration
import Examples.Code.Lists as Lists
import Examples.Code.Minimal as Minimal
import Examples.Code.Validation as Validation
import Examples.Code.Variants as Variants
import Examples.Combination as Combination
import Examples.Decoration as Decoration
import Examples.Lists as Lists
import Examples.Minimal as Minimal
import Examples.Validation as Validation
import Examples.Variants as Variants
import FancyForms.Form as Form exposing (FieldWithErrors, Form, Variants, extract, field, fieldWithVariants, toWidget, validate, wrap)
import FancyForms.FormState as FormState exposing (Error(..), FormState, Widget, alwaysValid, withFocus)
import FancyForms.Widgets.Dropdown exposing (dropdown)
import FancyForms.Widgets.Int exposing (greaterThan, integerInput)
import FancyForms.Widgets.Text exposing (notBlank, textInput)
import Html exposing (Html, a, article, button, div, footer, h3, label, text, textarea)
import Html.Attributes exposing (class, classList, for, name, spellcheck, start, style, value)
import Html.Events exposing (onClick, onInput)
import Html.Lazy
import Json.Decode as Decode
import Markdown
import Parser
import Set exposing (Set)
import SyntaxHighlight as SH
import Html exposing (li)
import Html.Attributes exposing (href)
import Html exposing (br)
import Html exposing (small)
import Html exposing (ul)
import Html exposing (header)
import Html exposing (section)
import Html exposing (h2)


type alias Model =
    { minimal : Minimal.Model
    , validation : Validation.Model
    , decoration : Decoration.Model
    , combination : Combination.Model
    , lists : Lists.Model
    , variants : Variants.Model
    , expanded : Set String
    }


type Example
    = Minimal
    | Validation
    | Decoration
    | Combination
    | Lists
    | Variants


exampleAsStr : Example -> String
exampleAsStr example =
    case example of
        Minimal ->
            "Minimal"

        Validation ->
            "Validation"

        Decoration ->
            "Decoration"

        Combination ->
            "Combination"

        Lists ->
            "Lists"

        Variants ->
            "Variants"


type Msg
    = ForMinimal Minimal.Msg
    | ForValidation Validation.Msg
    | ForDecoration Decoration.Msg
    | ForCombination Combination.Msg
    | ForLists Lists.Msg
    | ForVariants Variants.Msg
    | Toggle Example


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
    ( { minimal = Minimal.init
      , validation = Validation.init
      , decoration = Decoration.init
      , combination = Combination.init
      , lists = Lists.init
      , variants = Variants.init
      , expanded = Set.empty
      }
    , Cmd.none
    )


currentForm : Form Ingredient MyError
currentForm =
    ingredientForm


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Toggle example ->
            if isExpanded example model then
                ( { model | expanded = Set.remove (exampleAsStr example) model.expanded }
                , Cmd.none
                )

            else
                ( { model | expanded = Set.insert (exampleAsStr example) model.expanded }
                , Cmd.none
                )

        ForMinimal subMsg ->
            ( { model | minimal = Minimal.update subMsg model.minimal }
            , Cmd.none
            )

        ForValidation subMsg ->
            ( { model | validation = Validation.update subMsg model.validation }
            , Cmd.none
            )

        ForDecoration subMsg ->
            ( { model | decoration = Decoration.update subMsg model.decoration }
            , Cmd.none
            )

        ForCombination subMsg ->
            ( { model | combination = Combination.update subMsg model.combination }
            , Cmd.none
            )

        ForLists subMsg ->
            ( { model | lists = Lists.update subMsg model.lists }
            , Cmd.none
            )

        ForVariants subMsg ->
            ( { model | variants = Variants.update subMsg model.variants }
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
    Html.main_ [class "container-fluid"]
        [ styles
        , SH.useTheme SH.monokai
        , a [name "top"] []
        --, div [] <| Form.render ForForm currentForm model.formState
        , viewToc
        , viewMinimal model
        , viewValidation model
        , viewDecoration model
        , viewCombination model
        , viewLists model
        , viewVariants model
        ]


isExpanded : Example -> Model -> Bool
isExpanded example model =
    Set.member (exampleAsStr example) model.expanded








minimalMarkdown =
    """
A form is declared by calling [`Form.form`](https://package.elm-lang.org/packages/axelerator/fancy-forms/1.0.0/FancyForms-Form#form)
to create an expression of type `Form data error`.
The `data` type parameter declares what type of data the form inputs will be converted to.
The `error` type parameter allows you to name your own error type for custom validations.

So this form declares a form that collects an `Int` from the user and doesn't have any custom validations
(it usese the unit type `()` as the `error` type parameter).

To track the state of the form we add a `FormState` field to our model and a `Msg` variant to modify it.

The second argument to the form is a function that receives an argument for each field.
It returns a record with two fields: `view` and `combine`.
The `view` function is used to render the field.
The `combine` function is used to extract the value from the form state.

We add fields to the form by "piping" the result of the `form` call into the [`field`](https://package.elm-lang.org/packages/axelerator/fancy-forms/1.0.0/FancyForms-Form#field)
function.

Here we only have a single `Int` input field. The `view` function can use the `amount` field to render the input widget.
The `combine` function can use the `amount` field to extract the value from the form state.
"""


htmlMap : (msg -> Msg) -> Html msg -> Html Msg
htmlMap toMsg html =
    article []
        [ Html.map toMsg html ]


partial : Model -> Example -> Int -> Int -> CodeRange
partial model example start end =
    if isExpanded example model then
        Complete

    else
        Partial start end


examples =
    [ { example = Minimal
      , code = Minimal.code
      , range = ( 13, 48 )
      , title = "Getting started"
      , subTitle = "The simplest possible form"
      }
    , { example = Validation
      , code = Validation.code
      , range = ( 16, 77 )
      , title = "Validations"
      , subTitle = "How to add validations to individual fields and entire forms"
      }
    , { example = Decoration
      , code = Decoration.code
      , range = ( 20, 59 )
      , title = "Decoration/Wrapping of input widgets"
      , subTitle = "Controlling markup of fields without changing widgets"
      }
    , { example = Combination
      , code = Combination.code
      , range = ( 27, 56 )
      , title = "Combination: Reusing forms by combining them"
      , subTitle = "How to turn forms into input widgets"
      }
    , { example = Lists
      , code = Lists.code
      , range = ( 19, 44 )
      , title = "Lists"
      , subTitle = "How to add repeatable elements to a form"
      }
    , { example = Variants
      , code = Variants.code
      , range = ( 21, 69 )
      , title = "Variants"
      , subTitle = "Letting the user choose between multiple sub forms"
      }
    ]


viewMinimal : Model -> Html Msg
viewMinimal model =
    Minimal.view model.minimal
        |> viewExample model minimalMarkdown ForMinimal Minimal


validationMarkdown =
    """
#### Per-form validation

Sometimes whether the data in the form is valid or not can't be determined
based on the input of a single field.

The first argument (`line 56`) to the `form` call is a function that returns errors based on
what would otherwise be returned as data from the **entire form**.

In this example we make sure that the selected day is in the correct range. To do so
we need to know which month and year the user has selected.

To display the errors that that occurr "per-form" we use the **second** argument that gets passed into our
`view` function. They are a `List (Error MyError)` and we have to convert them into human readable Html and
place them somewhere in our view (`line 60,64`)

#### Per-field validation

Per-field validations validate the input independently of the other fields
and display an error next to the input widget of that field.

The the widgets that get passed into the `field` declaration can optionally recieve
additional validations (`lines 66-68`) by calling the `validate` function with a list of functions that validate
inputs for that specific widget type.

Here we use the `greaterThan` validator to ensure that the user has selected a day, month and year that 
have a certain minimum value.

To ensure a consistent UX we assume that errors are always displayed in the same relation to the input
field they occur in. That's why the second argument to the `form` function is a function that places
a list of `Error MyError` relative to the input field.

Per-field validations are only executed the first time a field is blurred. This is because we wan't to
avoid the user being confronted with an "all red" form before they have entered anything.
"""


viewValidation : Model -> Html Msg
viewValidation model =
    Validation.view model.validation
        |> viewExample model validationMarkdown ForValidation Validation


decorationMarkdown =
    """
How the markup for an input field has to be structured varies from application to application.
Often it depends on the CSS framework you are using. This is why we keep the basic input widgets
as unopinionated and simple as possible.

To not having to repeat the same markup over and over again we can use the `Form.wrap` function.
It allows us add markup to an input widget without changing the logic of the widget itself.

We can use it to add a _"Decoration"_ when we declare the field (`line 59`) or create versions of
existing widgets like the `textInputWithLabel` (`line 36`).

One noteworthy aspect of the `Form.wrap` function is that it is aware of the unique `DomId` of the input
that gets wrapped. This is especially import in our _"label"_ case since we need to know the value of
the `id` attribute of the `input` element. Only if we use that value for the `for` attribute of the 
label element the user will be able to focus the input by clicking on the label.
"""


viewDecoration : Model -> Html Msg
viewDecoration model =
    Decoration.view model.decoration
        |> viewExample model decorationMarkdown ForDecoration Decoration


combinationMarkdown =
    """
The main difference to other form libraries is that we can create custom input widgets.
And the easiest way to do that is to turn **a form** into an **input widget**.

Here we are reusing the _"login"_ form from the "Decoration example" and the _"date"_ form
from the "Validation example".

We can use the `Form.toWidget` function to convert a form into an input widget.
These will yield a field that collects a _input value_ of the type that the form that we
converted collects.

For this to work, all widgets need to use the same custom `Error` type. Throughout these examples
we consistently use the `MyError` type.
"""


viewCombination : Model -> Html Msg
viewCombination model =
    Combination.view model.combination
        |> viewExample model combinationMarkdown ForCombination Combination


listsMarkdown =
    """
Another common use case is collecting a list of values. When the user determins the
number if items in the form we can't _"hard code"_ a list of fields.

In this case we can use the `listField` function.

To collect information for an item in in the list we can use
any widget that we want to collect a list of values. Here we use the `textInput` widget.

In addition we need to supply the `listField` function with two more arguments:

1. A function that will place a button to remove an item from the list in the vicinity of the item
2. A function that places a UI element to add a _new_ item to the list.
"""


viewLists : Model -> Html Msg
viewLists model =
    Lists.view model.lists
        |> viewExample model listsMarkdown ForLists Lists


variantsMarkdown =
    """
Often we want to let the user choose __"the kind"__ of date they want to enter.
When the choice affects the shape of the form we can use the `fieldWithVariants` function (`line 35`) to create a field.

The first argument is the widget that will be used to let the user choose the kind of data.
In this case we use the `dropdown` widget.

The next argument provides the default variant. Each variant is a `Tuple` of the label and the sub form.
The third argument is the list of all the other variants.

The resulting field will still only collect a value of a **single** type. 
So the widgets of all sub forms need to return the same type.
So pratically we will create a new sum type with a variant for each of the possible sub forms.
"""


viewVariants : Model -> Html Msg
viewVariants model =
    Variants.view model.variants
        |> viewExample model variantsMarkdown ForVariants Variants


viewExample model markdown toMsg example subView =
    section []
        [ h2 []
            [ a [ name <| exampleAsStr example ] []
            , text <| Maybe.withDefault "" <| Maybe.map .title <| findExample example
            ]
        , div [ class "grid" ]
            [ div []
                [ Markdown.toHtml [ class "content" ] markdown
                , htmlMap toMsg <| subView
                ]
            , viewCode example model
            ]
        , a [ class "top-link", href "#top" ] [ text "▲ Back to Top ▲" ]
        ]


viewTocEntry { title, example, subTitle } =
    li [] 
        [ a [ href <| "#" ++ exampleAsStr example ] [ text title ]
        , br [] []
        , small [] [text subTitle]
        ]


intro =
    Markdown.toHtml [ class "content" ] """
# FancyForms

[_FancyForms_ is a library](https://package.elm-lang.org/packages/axelerator/fancy-forms/1.0.0/) for building forms in Elm.
It is designed with the following goals in mind:

1. **Type saftey**: Data collected in the forms will be returned directly into a user provided type.
1. **Ease of use**: No matter how complex the form is, it will only need **one** `Msg` and **one** field on the model.
1. **Customization**: Users can provide their own widgets and custom validations.
1. **CSS Agnostic**: Adapts to any CSS framework.
1. **Composable**: Smaller forms can be combined into larger forms.
1. **I18n**: Internationalization is supported by avoiding hard coded strings.

"""


viewToc : Html Msg
viewToc =
    div [ class "grid" ]
        [ article [] [ intro ]
        , article [] 
            [ header [] [ text "Table of Contents" ] 
            ,   ul [] <|  List.map viewTocEntry examples
            ]
        ]


fieldWithErrors : FieldWithErrors MyError
fieldWithErrors errors html =
    [ div
        (if List.isEmpty errors then
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

        FormState.MustBeLesserThan n ->
            "must be lesser than " ++ String.fromInt n

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
    Form.form "liquid-form"
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
    Form.form "whole-form"
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
    Form.form "ingredient-form"
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
            ( "Liquid ingredient", liquidForm )
            [ ( "Whole ingredient", wholeForm ) ]


type alias HighlightModel =
    { mode : Maybe SH.Highlight
    , start : Int
    , end : Int
    }


codeToHtml : Maybe Int -> String -> HighlightModel -> Html msg
codeToHtml maybeStart str hlModel =
    SH.elm str
        |> Result.map (SH.highlightLines hlModel.mode hlModel.start hlModel.end)
        |> Result.map (SH.toBlockHtml maybeStart)
        |> Result.mapError Parser.deadEndsToString
        |> (\result ->
                case result of
                    Result.Ok a ->
                        a

                    Result.Err x ->
                        text x
           )


type CodeRange
    = Complete
    | Partial Int Int


findExample example =
    List.head <| List.filter (\e -> e.example == example) examples


viewCode example model =
    case findExample example of
        Nothing ->
            text ""

        Just { code, range } ->
            let
                ( content, startLine ) =
                    if isExpanded example model then
                        ( String.lines code
                            |> List.drop 1
                            |> String.join "\n"
                        , 1
                        )

                    else
                        let
                            ( start, end ) =
                                range
                        in
                        ( String.lines code
                            |> List.drop start
                            |> List.take ((end - start) + 1)
                            |> String.join "\n"
                        , start
                        )
            in
            div
                [ class "elmsh" ]
                [ div [ class "toggle", onClick (Toggle example) ] [ text "▼ toggle full example ▼" ]
                , div
                    [ class "view-container" ]
                    [ Html.Lazy.lazy3 codeToHtml
                        (Just startLine)
                        content
                        defaultHighlightModel
                    ]
                ]


type alias Scroll =
    { top : Float
    , left : Float
    }


defaultHighlightModel : HighlightModel
defaultHighlightModel =
    { mode = Nothing
    , start = 0
    , end = 0
    }


viewTextarea : (Scroll -> msg) -> (String -> msg) -> String -> Html msg
viewTextarea onScroll_ onInput_ codeStr =
    textarea
        [ value codeStr
        , classList
            [ ( "textarea", True )
            , ( "textarea-lc", True )
            ]
        , onInput onInput_
        , spellcheck False
        , Html.Events.on "scroll"
            (Decode.map2 Scroll
                (Decode.at [ "target", "scrollTop" ] Decode.float)
                (Decode.at [ "target", "scrollLeft" ] Decode.float)
                |> Decode.map onScroll_
            )
        ]
        []
