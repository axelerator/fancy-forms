module Examples.Code.MyErrorHandling exposing (code)

code ="""
module Examples.MyErrorHandling exposing (..)

import FancyForms.Form exposing (FieldWithErrors)
import FancyForms.FormState exposing (Error(..))
import Html exposing (Html, div, text)
import Html.Attributes exposing (class)


type MyError
    = MustNotBeGreaterThanDaysInMonth Int


viewErrors : List (Error MyError) -> Html msg
viewErrors errors =
    if List.isEmpty errors then
        text ""

    else
        div [ class "errors" ]
            [ List.map errorToString errors
                |> String.join " "
                |> text
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


errorToString : Error MyError -> String
errorToString e =
    case e of
        MustNotBeBlank ->
            "must not be blank"

        MustBeGreaterThan n ->
            "must be greater than " ++ String.fromInt n

        MustBeLesserThan n ->
            "must be lower than " ++ String.fromInt n

        CustomError ce ->
            case ce of
                MustNotBeGreaterThanDaysInMonth daysInMonth ->
                    "There are only " ++ String.fromInt daysInMonth ++ " days in this month"
"""
