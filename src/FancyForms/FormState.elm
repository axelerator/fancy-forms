module FancyForms.FormState exposing (..)

import Dict exposing (Dict)
import Html exposing (Html)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import Maybe exposing (withDefault)
import String exposing (fromInt)


type FormState
    = FormState
        { parentDomId : DomId
        , values : Dict FieldId Value
        , fieldStatus : Dict FieldId FieldStatus
        , allBlurred : Bool
        }


type FieldStatus
    = NotVisited
    | Focused
    | Changed
    | Blurred


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


blurAll : FormState -> FormState
blurAll (FormState formState) =
    FormState
        { formState
            | allBlurred = True
        }


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


type Effect
    = NoEffect
    | WasFocused
    | WasChanged
    | WasBlurred


type FieldOperation
    = Add
    | Remove
    | Update Value



{-
   List fields need an index additional to the FieldId to know which
   list item to update.
-}


type SubfieldId
    = SingleValue
    | ArrayElement Int


type alias FieldId =
    String


type alias UpdateResult model =
    { model : model
    , effect : Effect
    }


justChanged : model -> UpdateResult model
justChanged model =
    { model = model
    , effect = WasChanged
    }


justChangedInternally : model -> UpdateResult model
justChangedInternally model =
    { model = model
    , effect = NoEffect
    }


withBlur : model -> UpdateResult model
withBlur model =
    { model = model
    , effect = WasBlurred
    }


withFocus : model -> UpdateResult model
withFocus model =
    { model = model
    , effect = WasFocused
    }


type alias Widget model msg value customError =
    { init : model
    , value : model -> value
    , validate : Validator model customError
    , view : DomId -> model -> List (Html msg)
    , update : msg -> model -> UpdateResult model
    , encodeMsg : msg -> Value
    , decoderMsg : Decoder msg
    , encodeModel : model -> Value
    , decoderModel : Decoder model
    , blur : model -> model
    }


type alias Validator a e =
    a -> List (Error e)


type Error customError
    = MustNotBeBlank
    | MustBeGreaterThan Int
    | CustomError customError


type alias DomId =
    String

init : Dict FieldId Value -> FormState
init values =
    FormState
        { parentDomId = ""
        , values = values
        , fieldStatus = Dict.empty
        , allBlurred = False
        }

formStateEncode : FormState -> Value
formStateEncode (FormState { parentDomId, values, fieldStatus, allBlurred }) =
    E.object
        [ ( "parentDomId", E.string parentDomId )
        , ( "values", E.dict identity identity values )
        , ( "fieldStatus", E.dict identity encodeFieldStatus fieldStatus )
        , ( "allBlurred", E.bool allBlurred )
        ]


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


read : FieldId -> FormState -> Value
read fieldId (FormState { values }) =
    values
        |> Dict.get fieldId
        |> withDefault (E.object [])


write : FieldId -> SubfieldId -> FormState -> Value -> FormState
write fieldId subfieldId (FormState formState) value =
    FormState
        { formState
            | values =
                Dict.insert (toKey fieldId subfieldId) value formState.values
        }


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


alwaysValid : Validator a e
alwaysValid _ =
    []


encodedUpdate :
    Widget model msg value customError
    -> SubfieldId
    -> FieldOperation
    -> Value
    -> Value
encodedUpdate ({ decoderMsg, decoderModel, encodeModel } as widget) subfieldId operation modelVal =
    let
        _ =
            Debug.log "encodedUpdate" <|
                case operation of
                    Add ->
                        "add"

                    Remove ->
                        "remove"

                    Update uv ->
                        E.encode -1 uv

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
                        |> Result.withDefault (List.repeat (i + 1) widget.init)
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
                            ++ [ Debug.log "adding" widget.init ]
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

                ( Ok msg, _ ) ->
                    widget.update msg widget.init |> .model |> encodeSubfield

                ( e1, _ ) ->
                    let
                        _ =
                            Debug.log "invalde" ( e1, E.encode -1 msgVal, modelVal )
                    in
                    modelVal

        _ ->
            let
                _ =
                    Debug.log "unknown operation" operation
            in
            modelVal


blurChildren : FieldId -> Widget model msg value customError -> FormState -> FormState
blurChildren fieldId widget ((FormState ({ values } as formState)) as fs) =
    let
        blurredModel =
            read fieldId fs
                |> D.decodeValue widget.decoderModel
                |> Result.map widget.blur
                |> Result.map widget.encodeModel
                |> Result.withDefault (widget.encodeModel widget.init)
    in
    FormState 
        { formState 
        | values = Dict.insert fieldId blurredModel values
        , allBlurred = True
        }

