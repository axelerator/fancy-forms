module Examples.Validation exposing (..)

import FancyForms.Form as Form exposing (FieldWithErrors, Form, field, validate)
import FancyForms.FormState exposing (Error(..), FormState)
import FancyForms.Widgets.Int exposing (greaterThan, integerInput, lesserThan)
import Html exposing (Html, button, div, label, p, text)
import Html.Attributes exposing (class, classList, disabled)
import Html.Events exposing (onClick)
import String exposing (fromInt)
import Html.Attributes exposing (attribute)
import Html exposing (small)


type alias Model =
    { formState : FormState }


type Msg
    = ForForm Form.Msg
    | Submit


type alias Date =
    { day : Int
    , month : Int
    , year : Int
    }


type MyError
    = MustNotBeGreaterThanDaysInMonth Int


daysOfMonthValidator : Date -> List (Error MyError)
daysOfMonthValidator { day, month, year } =
    if day > daysInMonth month year then
        [ CustomError <| MustNotBeGreaterThanDaysInMonth (daysInMonth month year) ]

    else
        []


viewErrors : List (Error MyError) -> Html msg
viewErrors errors =
    if List.isEmpty errors then
        text ""

    else
        small []
            [ List.map errorToString errors
                |> String.join " "
                |> text
            ]


fieldWithErrors : FieldWithErrors MyError
fieldWithErrors errors html =
    [ div [ classList [ ( "has-error", not <| List.isEmpty errors ) ] ]
        (html ++ [ viewErrors errors ])
    ]


myForm : Form Date MyError
myForm =
    Form.form 
        fieldWithErrors
        daysOfMonthValidator
        "validation-example"
        (\day month year ->
            { view =
                \formState errors ->
                    [ div [ class "errors" ]
                        [ List.map errorToString errors
                            |> String.join " "
                            |> text
                        ]
                    , div [ class "grid" ] <|
                        [ label [] <| text "Day:" :: day.view formState
                        , label [] <| text "Month:" :: month.view formState
                        , label [] <| text "Year: " :: year.view formState
                        ]
                    ]
            , combine =
                \formState ->
                    { day = day.value formState
                    , month = month.value formState
                    , year = year.value formState
                    }
            }
        )
        |> field .day (integerInput [] |> validate [ greaterThan 0 ])
        |> field .month (integerInput [] |> validate [ greaterThan 0, lesserThan 13 ])
        |> field .year (integerInput [] |> validate [ greaterThan 1900 ])

markAsInvalid errors _ =
    if List.isEmpty errors then
        []
    else
        [attribute "aria-invalid" "true"]

takeDay : Date -> Int
takeDay { day } =
    day


errorToString : Error MyError -> String
errorToString e =
    case e of
        NotValid ->
            ""

        MustNotBeBlank ->
            "must not be blank"

        MustBeGreaterThan n ->
            "must be greater than " ++ n

        MustBeLesserThan n ->
            "must be lower than " ++ n

        CustomError ce ->
            case ce of
                MustNotBeGreaterThanDaysInMonth daysInMonth_ ->
                    "There are only " ++ String.fromInt daysInMonth_ ++ " days in this month"


view model =
    div []
        [ div [] <| Form.render ForForm myForm model.formState
        , div []
            [ button
                [ onClick Submit
                , disabled <| not <| Form.isValid myForm model.formState
                ]
                [ text "Submit" ]
            ]
        , p [] [ text "The user entered: " ]
        , viewDate <| Form.extract myForm model.formState
        ]


init =
    { formState = Form.init myForm { day = 1, month = 1, year = 2000 } }


update : Msg -> Model -> Model
update msg model =
    case msg of
        ForForm formMsg ->
            { model | formState = Form.update myForm formMsg model.formState }

        Submit ->
            model


viewDate { day, month, year } =
    div []
        [ div []
            [ text "day: "
            , text <| fromInt day
            , text " month: "
            , text <| fromInt month
            , text " year: "
            , text <| fromInt year
            ]
        ]


daysInMonth : Int -> Int -> Int
daysInMonth month year =
    case month of
        1 ->
            31

        2 ->
            if (modBy 4 year == 0) && (modBy 100 year /= 0) || (modBy 400 year == 0) then
                29

            else
                28

        3 ->
            31

        5 ->
            31

        7 ->
            31

        8 ->
            31

        10 ->
            31

        12 ->
            31

        _ ->
            30
