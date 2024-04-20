module FancyForms.FormState exposing
    ( DomId, Error(..), FormState(..), Validator, Widget
    , alwaysValid, blurAll, init
    , blurChildren, Effect(..), FieldId, FieldOperation(..), FieldStatus(..), SubfieldId(..), UpdateResult, encodedUpdate, formStateDecoder, formStateEncode, justChanged, justChangedInternally, read, subId, updateFieldStatus, wasAtLeast, withBlur, withFocus, write, withInnerAttributes, noAttributes
    )

{-| Exposes various types used to track state of the form.


# Types used in the declaration of forms

@docs DomId, Error, FormState, Validator, Widget


# Helper to construct forms or modify state

@docs alwaysValid, blurAll, init


# Advanced helpers to cunstruc widgets from scratch

@docs blurChildren, Effect, FieldId, FieldOperation, FieldStatus, SubfieldId, UpdateResult, encodedUpdate, formStateDecoder, formStateEncode, justChanged, justChangedInternally, read, subId, updateFieldStatus, wasAtLeast, withBlur, withFocus, write, withInnerAttributes, noAttributes

-}

import Dict exposing (Dict, values)
import Html exposing (Html)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import Maybe exposing (withDefault)
import String exposing (fromInt)


{-| The state of the form. Stores all the values and the status of each field.
-}
type FormState
    = FormState
        { parentDomId : DomId
        , values : Dict FieldId Value
        , fieldStatus : Dict FieldId FieldStatus
        , allBlurred : Bool
        }


{-| The status of a field. We'll only expose the result of a field validation after it has been blurred.
-}
type FieldStatus
    = NotVisited
    | Focused
    | Changed
    | Blurred


{-| Updates the status of a field based on an effect
-}
updateFieldStatus : FieldStatus -> Effect -> FieldStatus
updateFieldStatus status effect =
    case ( status, effect ) of
        ( NotVisited, NoEffect ) ->
            NotVisited

        ( NotVisited, WasChanged ) ->
            Changed

        ( NotVisited, WasFocused ) ->
            Focused

        ( NotVisited, WasBlurred ) ->
            Blurred

        ( Focused, NoEffect ) ->
            Focused

        ( Focused, WasChanged ) ->
            Changed

        ( Focused, WasFocused ) ->
            Focused

        ( Focused, WasBlurred ) ->
            Blurred

        ( Changed, WasBlurred ) ->
            Blurred

        ( Changed, _ ) ->
            Changed

        ( Blurred, _ ) ->
            Blurred


{-| Marks all fields as blurred. This is needed to show all errors when trying to submit a
form without the user having visited all fields.
-}
blurAll : FormState -> FormState
blurAll (FormState formState) =
    FormState
        { formState
            | allBlurred = True
        }


{-| Helper to check if a field was visited
-}
wasAtLeast : FieldStatus -> FieldId -> FormState -> Bool
wasAtLeast goal fieldId (FormState { fieldStatus, allBlurred }) =
    let
        tested =
            Dict.get fieldId fieldStatus
                |> withDefault NotVisited
    in
    if allBlurred then
        True

    else
        case ( tested, goal ) of
            ( NotVisited, NotVisited ) ->
                True

            ( NotVisited, _ ) ->
                False

            ( Focused, NotVisited ) ->
                True

            ( Focused, Focused ) ->
                True

            ( Focused, _ ) ->
                False

            ( Changed, Blurred ) ->
                False

            ( Changed, _ ) ->
                True

            ( Blurred, Blurred ) ->
                True

            ( Blurred, _ ) ->
                False


{-| Specifies the effect of a field with relation to the focus state.
-}
type Effect
    = NoEffect
    | WasFocused
    | WasChanged
    | WasBlurred


{-| Specifies the operation to perform on a field. `Add` and `Remove` are
used for list fields.
-}
type FieldOperation
    = Add
    | Remove
    | Update Value


{-| List fields need an index additional to the FieldId to know which
list item to update.
-}
type SubfieldId
    = SingleValue
    | ArrayElement Int


{-| A unique identifier for a field in a form.
-}
type alias FieldId =
    String


{-| Is returned from the `update` function of a `Widget`
-}
type alias UpdateResult model =
    { model : model
    , effect : Effect
    }


{-| Wraps the given model with the indication that the field was changed in a way that it must also have been focused.
-}
justChanged : model -> UpdateResult model
justChanged model =
    { model = model
    , effect = WasChanged
    }


{-| Wraps the given model with the indication that the field was changed but didn't change the focus.
-}
justChangedInternally : model -> UpdateResult model
justChangedInternally model =
    { model = model
    , effect = NoEffect
    }


{-| Wraps the given model with the indication that the field was blurred.
-}
withBlur : model -> UpdateResult model
withBlur model =
    { model = model
    , effect = WasBlurred
    }


{-| Wraps the given model with the indication that the field was focused.
-}
withFocus : model -> UpdateResult model
withFocus model =
    { model = model
    , effect = WasFocused
    }


{-| A widget that can be used to create a form field.
-}
type alias Widget model msg value customError =
    { init : value -> model
    , default : value
    , value : model -> value
    , validate : Validator value customError
    , isConsistent : model -> Bool
    , view : DomId -> List (Html.Attribute msg) -> model -> List (Html msg)
    , update : msg -> model -> UpdateResult model
    , encodeMsg : msg -> Value
    , decoderMsg : Decoder msg
    , encodeModel : model -> Value
    , decoderModel : Decoder model
    , blur : model -> model
    , innerAttributes : List (Error customError) -> value -> List (Html.Attribute msg)
    }


{-| The default for a `Widget`
-}
noAttributes : List (Error customError) -> value -> List (Html.Attribute msg)
noAttributes _ _ =
    []


{-| You can provide a function that generates a list of attributes for the inner widget.
This function can use the current value and errors to generate the attributes.
-}
withInnerAttributes :
    (List (Error customError) -> value -> List (Html.Attribute msg))
    -> Widget model msg value customError
    -> Widget model msg value customError
withInnerAttributes f widget =
    let
        combined errors value =
            widget.innerAttributes errors value ++ f errors value
    in
    { widget | innerAttributes = combined }


{-| A validator is a function that can be used to validate the value of a form or a widget.
-}
type alias Validator a e =
    a -> List (Error e)


{-| A type for errors that can be generated by a `Validator`
-}
type Error customError
    = NotValid
    | MustNotBeBlank
    | MustBeGreaterThan String
    | MustBeLesserThan String
    | CustomError customError


{-| A unique identifier for a field in a form.
-}
type alias DomId =
    String


{-| Creates a new form state with the given values.
-}
init : Dict FieldId Value -> DomId -> FormState
init values parentDomId =
    FormState
        { parentDomId = parentDomId
        , values = values
        , fieldStatus = Dict.empty
        , allBlurred = False
        }


{-| Encodes a form state into a JSON value
-}
formStateEncode : FormState -> Value
formStateEncode (FormState { parentDomId, values, fieldStatus, allBlurred }) =
    E.object
        [ ( "parentDomId", E.string parentDomId )
        , ( "values", E.dict identity identity values )
        , ( "fieldStatus", E.dict identity encodeFieldStatus fieldStatus )
        , ( "allBlurred", E.bool allBlurred )
        ]


{-| Decodes a form state from a JSON value
-}
formStateDecoder : Decoder FormState
formStateDecoder =
    D.map4
        (\parentDomId values fieldStatus allBlurred ->
            FormState { parentDomId = parentDomId, values = values, fieldStatus = fieldStatus, allBlurred = allBlurred }
        )
        (D.field "parentDomId" D.string)
        (D.field "values" <| D.dict D.value)
        (D.field "fieldStatus" <| D.dict decoderFieldStatus)
        (D.field "allBlurred" D.bool)


encodeFieldStatus : FieldStatus -> Value
encodeFieldStatus status =
    case status of
        NotVisited ->
            E.string "NotVisited"

        Focused ->
            E.string "Focused"

        Changed ->
            E.string "Changed"

        Blurred ->
            E.string "Blurred"


decoderFieldStatus : Decoder FieldStatus
decoderFieldStatus =
    D.string
        |> D.andThen
            (\s ->
                case s of
                    "NotVisited" ->
                        D.succeed NotVisited

                    "Focused" ->
                        D.succeed Focused

                    "Changed" ->
                        D.succeed Changed

                    "Blurred" ->
                        D.succeed Blurred

                    _ ->
                        D.fail "invalid field status"
            )


{-| Reads the value for the given field.
-}
read : FieldId -> FormState -> Value
read fieldId (FormState { values }) =
    values
        |> Dict.get fieldId
        |> withDefault (E.object [])


{-| Updates the value for the given field.
-}
write : FieldId -> SubfieldId -> FormState -> Value -> FormState
write fieldId subfieldId (FormState formState) value =
    FormState
        { formState
            | values =
                Dict.insert (toKey fieldId subfieldId) value formState.values
        }


{-| Calculates the dom id for the given field and subfield.
-}
subId : DomId -> FieldId -> SubfieldId -> DomId
subId parentDomId fieldId subfieldId =
    [ parentDomId, toKey fieldId subfieldId ]
        |> String.join "-"


toKey : FieldId -> SubfieldId -> String
toKey fieldId subfieldId =
    case subfieldId of
        SingleValue ->
            fieldId

        ArrayElement i ->
            fieldId ++ "-" ++ fromInt i


{-| Creates a validator that always succeeds.

Useful for forms that fully rely on per-field validations.

-}
alwaysValid : Validator a e
alwaysValid _ =
    []


{-| Encodes the update for the given field.
-}
encodedUpdate :
    Widget model msg value customError
    -> SubfieldId
    -> FieldOperation
    -> Value
    -> Value
encodedUpdate ({ decoderMsg, decoderModel, encodeModel } as widget) subfieldId operation modelVal =
    let
        decodeSubfield =
            case subfieldId of
                SingleValue ->
                    decoderModel

                ArrayElement i ->
                    D.index i decoderModel

        encodeSubfield updatedModel =
            case subfieldId of
                SingleValue ->
                    encodeModel updatedModel

                ArrayElement i ->
                    D.decodeValue (D.list decoderModel) modelVal
                        |> Result.withDefault []
                        |> List.indexedMap
                            (\idx e ->
                                if idx == i then
                                    updatedModel

                                else
                                    e
                            )
                        |> E.list encodeModel
    in
    case ( operation, subfieldId ) of
        ( Add, ArrayElement _ ) ->
            D.decodeValue (D.list decoderModel) modelVal
                |> Result.withDefault []
                |> (\list ->
                        list
                            ++ [ widget.init widget.default ]
                            |> E.list encodeModel
                   )

        ( Remove, ArrayElement i ) ->
            D.decodeValue (D.list decoderModel) modelVal
                |> Result.withDefault []
                |> (\list -> List.take i list ++ List.drop (i + 1) list)
                |> E.list encodeModel

        ( Update msgVal, _ ) ->
            case ( D.decodeValue decoderMsg msgVal, D.decodeValue decodeSubfield modelVal ) of
                ( Ok msg, Ok model ) ->
                    widget.update msg model |> .model |> encodeSubfield

                _ ->
                    modelVal

        _ ->
            modelVal


{-| Internal: Used to recursively blur child fields.
-}
blurChildren : FieldId -> Widget model msg value customError -> FormState -> FormState
blurChildren fieldId widget ((FormState ({ values } as formState)) as fs) =
    let
        blurredModel =
            read fieldId fs
                |> D.decodeValue widget.decoderModel
                |> Result.map widget.blur
                |> Result.map widget.encodeModel
                |> Result.withDefault E.null
    in
    FormState
        { formState
            | values = Dict.insert fieldId blurredModel values
            , allBlurred = True
        }
