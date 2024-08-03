module Main exposing (main)

import Browser
import Examples.Code.Combination as Combination
import Examples.Code.CustomEvents as CustomEvents
import Examples.Code.Decoration as Decoration
import Examples.Code.Lists as Lists
import Examples.Code.Minimal as Minimal
import Examples.Code.Validation as Validation
import Examples.Code.Variants as Variants
import Examples.Combination as Combination
import Examples.CustomEvents as CustomEvents
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
import Html exposing (Html, a, article, br, button, div, footer, h2, h3, header, label, li, section, small, text, textarea, ul)
import Html.Attributes exposing (class, classList, for, href, name, spellcheck, start, style, value)
import Html.Events exposing (onClick, onInput)
import Html.Lazy
import Json.Decode as Decode
import Markdown
import Parser
import Set exposing (Set)
import SyntaxHighlight as SH


type alias Model =
    { minimal : Minimal.Model
    , validation : Validation.Model
    , decoration : Decoration.Model
    , combination : Combination.Model
    , lists : Lists.Model
    , variants : Variants.Model
    , customEvents : CustomEvents.Model
    , expanded : Set String
    }


type Example
    = Minimal
    | Validation
    | Decoration
    | Combination
    | Lists
    | Variants
    | CustomEvents


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

        CustomEvents ->
            "CustomEvents"


type Msg
    = ForMinimal Minimal.Msg
    | ForValidation Validation.Msg
    | ForDecoration Decoration.Msg
    | ForCombination Combination.Msg
    | ForLists Lists.Msg
    | ForVariants Variants.Msg
    | ForCustomEvents CustomEvents.Msg
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
      , customEvents = CustomEvents.init
      , expanded = Set.empty
      }
    , Cmd.none
    )


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

        ForCustomEvents subMsg ->
            ( { model | customEvents = CustomEvents.update subMsg model.customEvents }
            , Cmd.none
            )


view : Model -> Html Msg
view model =
    Html.main_ [ class "container-fluid" ]
        [ SH.useTheme SH.monokai
        , a [ name "top" ] []
        , viewToc
        , viewMinimal model
        , viewValidation model
        , viewDecoration model
        , viewCombination model
        , viewLists model
        , viewVariants model
        , viewCustomEvents model
        ]


isExpanded : Example -> Model -> Bool
isExpanded example model =
    Set.member (exampleAsStr example) model.expanded


minimalMarkdown =
    """
A form is declared by calling [`Form.form`](https://package.elm-lang.org/packages/axelerator/fancy-forms/2.0.0/FancyForms-Form#form)
to create an expression of type `Form data error`.
The `data` type parameter declares what type of data the form inputs will be converted to.
The `error` type parameter allows you to name your own error type for custom validations.

So this form declares a form that collects an `Int` from the user and doesn't have any custom validations
(it usese the unit type `()` as the `error` type parameter).

To track the state of the form we add a `FormState` field to our model and a `Msg` variant to modify it.
We use the `Form.init` function to create the inital `FormState` with the values we want the form to start with.

The second argument to the form is a function that receives an argument for each field.
It returns a record with two fields: `view` and `combine`.
The `view` function is used to render the field.
The `combine` function is used to extract the value from the form state.

We add fields to the form by "piping" the result of the `form` call into the [`field`](https://package.elm-lang.org/packages/axelerator/fancy-forms/2.0.0/FancyForms-Form#field)
function.

Here we only have a single `Int` input field. The `view` function can use the `amount` field to render the input widget.
The `combine` function can use the `amount` field to extract the value from the form state.
""" |> Markdown.toHtml []


htmlMap : (msg -> Msg) -> Html msg -> Html Msg
htmlMap toMsg html =
    article []
        [ Html.map toMsg html ]


examples =
    [ { example = Minimal
      , code = Minimal.code
      , range = ( 12, 48 )
      , title = "Getting started"
      , subTitle = "The simplest possible form"
      }
    , { example = Validation
      , code = Validation.code
      , range = ( 16, 90 )
      , title = "Validations"
      , subTitle = "How to add validations to individual fields and entire forms"
      }
    , { example = Decoration
      , code = Decoration.code
      , range = ( 19, 61 )
      , title = "Decoration/Wrapping of input widgets"
      , subTitle = "Controlling markup of fields without changing widgets"
      }
    , { example = Combination
      , code = Combination.code
      , range = ( 19, 53 )
      , title = "Combination: Reusing forms by combining them"
      , subTitle = "How to turn forms into input widgets"
      }
    , { example = Lists
      , code = Lists.code
      , range = ( 19, 48 )
      , title = "Lists"
      , subTitle = "How to add repeatable elements to a form"
      }
    , { example = Variants
      , code = Variants.code
      , range = ( 13, 45 )
      , title = "Variants"
      , subTitle = "Letting the user choose between multiple sub forms"
      }
    , { example = CustomEvents
      , code = CustomEvents.code
      , range = ( 25, 73 )
      , title = "Custom events"
      , subTitle = "Emitting custom events from the form"
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

The first argument to the `form` call is a function that returns errors based on
what would otherwise be returned as data from the **entire form**.

In this example we make sure that the selected day is in the correct range. To do so
we need to know which month and year the user has selected.

To display the errors that that occurr "per-form" we use the **second** argument that gets passed into our
`view` function. They are a `List (Error MyError)` and we have to convert them into human readable Html and
place them somewhere in our view

To assess whether to for example submit the value entered by the user we can use
the `isValid` predicate. This will return `False` if any of the forms or it's fields have an error.

#### Per-field validation

Per-field validations validate the input independently of the other fields
and display an error next to the input widget of that field.

The the widgets that get passed into the `field` declaration can optionally recieve
additional validations by calling the `validate` function with a list of functions that validate
inputs for that specific widget type.

Here we use the `greaterThan` validator to ensure that the user has selected a day, month and year that 
have a certain minimum value.

To ensure a consistent UX we assume that errors are always displayed in the same relation to the input
field they occur in. That's why the second argument to the `form` function is a function that places
a list of `Error MyError` relative to the input field.

Per-field validations are only executed the first time a field is blurred. This is because we wan't to
avoid the user being confronted with an "all red" form before they have entered anything.
""" |> Markdown.toHtml []


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

We can use it to add a _"Decoration"_ when we declare the field or create versions of
existing widgets like the `textInputWithLabel`.

One noteworthy aspect of the `Form.wrap` function is that it is aware of the unique `DomId` of the input
that gets wrapped. This is especially import in our _"label"_ case since we need to know the value of
the `id` attribute of the `input` element. Only if we use that value for the `for` attribute of the 
label element the user will be able to focus the input by clicking on the label.
""" |> Markdown.toHtml []


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
""" |> Markdown.toHtml []


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

In addition to the input widget for the list items we need to supply the `listField` function
with a few more arguments:

1. A function that will place a button to remove an item from the list in the vicinity of the item
2. A function that places a UI element to add a _new_ item to the list.
3. A default value for a new item.
4. A function that extracts the inital list from the initial value of the form.

""" |> Markdown.toHtml []


viewLists : Model -> Html Msg
viewLists model =
    Lists.view model.lists
        |> viewExample model listsMarkdown ForLists Lists


variantsMarkdown1 =
    """
Often we want to let the user choose __"the kind"__ of date they want to enter.
When the choice affects the shape of the form we can use the `fieldWithVariants` function to create a field.

The first argument is the widget that will be used to let the user choose the kind of data.
In this case we use the `dropdown` widget.
""" |> Markdown.toHtml []


variantsMarkdown2 =
    """
The next argument provides the default variant. Each variant is a `Tuple` of the label and the sub form.
The third argument is the list of all the other variants.

Lastly we need a function that extracts the inital variant from the initial value of the form.
This function also needs to tell us which variant to use to edit it. That's why `fromForm` returns a tuple.

The resulting field will still only collect a value of a **single** type. 
So the widgets of all sub forms need to return the same type.
So pratically we will create a new sum type with a variant for each of the possible sub forms.
""" |> Markdown.toHtml []


viewVariants : Model -> Html Msg
viewVariants model =
    let
        description =
            div []
                [ variantsMarkdown1
                , text "But we could also use the "
                , small [] [ button [ onClick <| ForVariants Variants.ToggleSwitcher ] [ text "radioButtons" ] ]
                , text " widget."
                , variantsMarkdown2
                ]
    in
    Variants.view model.variants
        |> viewExample model description ForVariants Variants


viewCustomEvents : Model -> Html Msg
viewCustomEvents model =
    let
        description =
            div []
                [ customEventsMarkdown
                ]
    in
    CustomEvents.view model.customEvents
        |> viewExample model description ForCustomEvents CustomEvents


customEventsMarkdown =
    """
One thing we can't easily do is to send `Msg` from the outside app from __inside__ the form.    
The way the form widgets can be arbitrarily nested is thal all its messages get serialized to JSON and back.

We can't infer how to do that for message from the outside.
Instead of adding another type parameter and functions for serializing to the form functions we offer a
workaround: You can emit a _"custom event"_ with arbitrary JSON data from within the form.

This obviously sacrifices a lot of type safety, but is the best we can do without making the general API
even more complicated.

The user can use the `getCustomEvent` function during the `update` to extract the custom data.
These events can even be used to update the content of the form as shown in the following example.

In real life use one should use a symmetric pair of de-/encoders instead of de-/encoding
in the view/update functions.
""" |> Markdown.toHtml []


viewExample model description toMsg example subView =
    section []
        [ h2 []
            [ a [ name <| exampleAsStr example ] []
            , text <| Maybe.withDefault "" <| Maybe.map .title <| findExample example
            ]
        , div [ class "grid" ]
            [ div []
                [ description
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
        , small [] [ text subTitle ]
        ]


intro =
    Markdown.toHtml [ class "content" ] """
# FancyForms

[_FancyForms_ is a library](https://package.elm-lang.org/packages/axelerator/fancy-forms/2.0.0/) for building forms in Elm.
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
            , ul [] <| List.map viewTocEntry examples
            ]
        ]


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
