module FormState exposing (..)

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
        }

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


type alias Widget model msg value customError =
    { init : model
    , value : model -> value
    , validate : Validator model customError
    , view : DomId -> model -> List (Html msg)
    , update : msg -> model -> model
    , encodeMsg : msg -> Value
    , decoderMsg : Decoder msg
    , encodeModel : model -> Value
    , decoderModel : Decoder model
    }


type alias Validator a e =
    a -> List (Error e)


type Error customError
    = MustNotBeBlank
    | CustomError customError




type alias DomId =
    String


formStateEncode : FormState -> Value
formStateEncode (FormState { values }) =
    E.dict identity identity values


formStateDecoder : Decoder FormState
formStateDecoder =
    D.dict D.value
        |> D.andThen (\d -> D.succeed <| FormState { values = d, parentDomId = "" })


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
                    widget.update msg model |> encodeSubfield

                ( Ok msg, _) ->
                    widget.update msg widget.init |> encodeSubfield

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
