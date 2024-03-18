module Form exposing (..)

import Dict exposing (Dict)
import Html exposing (Html)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import Maybe exposing (withDefault)
import String exposing (fromInt, toInt)


type Msg
    = FormMsg FieldId Value


updateField : FormInternal a -> FieldId -> Value -> FormState -> FormState
updateField { updates } fieldId msgValue ((FormState formState) as fs) =
    let
        updateFn =
            Dict.get fieldId updates
                |> withDefault (\_ modelValue_ -> modelValue_)

        modelValue =
            read fieldId fs

        updatedModelValue =
            updateFn msgValue modelValue
    in
    FormState { formState | values = Dict.insert fieldId updatedModelValue formState.values }


type alias FieldId =
    Int


type FormState
    = FormState
        { parentDomId : DomId
        , values : Dict FieldId Value
        }


type alias Field a =
    { id : FieldId
    , value : FormState -> a
    , view : FormState -> Html Msg
    }


read : FieldId -> FormState -> Value
read fieldId (FormState { values }) =
    Dict.get fieldId values
        |> withDefault (E.object [])


mkField : FieldId -> Widget a msg value -> Field value
mkField fieldId widget =
    let
        convert : FormState -> a
        convert formState =
            D.decodeValue widget.decoderModel (read fieldId formState)
                |> Result.toMaybe
                |> withDefault widget.init

        viewField : FormState -> Html Msg
        viewField ((FormState { parentDomId }) as formState) =
            let
                toMsg : msg -> Msg
                toMsg msg =
                    FormMsg fieldId <|
                        widget.encodeMsg msg
            in
            convert formState
                |> widget.view (parentDomId ++ "f-" ++ fromInt fieldId)
                |> Html.map toMsg
    in
    { id = fieldId
    , value = \formState -> widget.value <| convert formState
    , view = viewField
    }


type alias Form data =
    FormInternal { view : FormState -> Html Msg, combine : FormState -> data }


init : FormState
init =
    FormState
        { parentDomId = ""
        , values = Dict.empty
        }


type alias FormInternal f =
    { fn : f
    , count : Int
    , updates : Dict FieldId (Value -> Value -> Value)
    }


form : a -> FormInternal a
form fn =
    { fn = fn
    , count = 0
    , updates = Dict.empty
    }


field : Widget widgetModel msg value -> FormInternal (Field value -> c) -> FormInternal c
field widget { fn, count, updates } =
    { fn = fn (mkField count widget)
    , count = count + 1
    , updates =
        Dict.insert
            count
            (encodedUpdate widget)
            updates
    }


wrap :
    Widget widgetModel msg value
    -> (DomId -> Html msg -> Html msg)
    -> Widget widgetModel msg value
wrap widget container =
    { init = widget.init
    , value = widget.value
    , view = \domId model -> container domId <| widget.view domId model
    , update = widget.update
    , encodeMsg = widget.encodeMsg
    , decoderMsg = widget.decoderMsg
    , encodeModel = widget.encodeModel
    , decoderModel = widget.decoderModel
    }


encodedUpdate :
    Widget model msg value
    -> Value
    -> Value
    -> Value
encodedUpdate ({ decoderMsg, decoderModel, encodeModel } as widget) msgVal modelVal =
    case ( D.decodeValue decoderMsg msgVal, D.decodeValue decoderModel modelVal ) of
        ( Ok msg, Ok model ) ->
            widget.update msg model |> encodeModel

        ( Ok msg, _ ) ->
            widget.update msg widget.init |> encodeModel

        _ ->
            modelVal


type alias DomId =
    String


type alias Widget model msg value =
    { init : model
    , value : model -> value
    , view : DomId -> model -> Html msg
    , update : msg -> model -> model
    , encodeMsg : msg -> Value
    , decoderMsg : Decoder msg
    , encodeModel : model -> Value
    , decoderModel : Decoder model
    }


toWidget : Form a -> Widget FormState Msg a
toWidget f =
    { init = init
    , value = f.fn.combine
    , view = \domId (FormState model) -> f.fn.view (FormState { model | parentDomId = Debug.log "domId" domId })
    , update = \(FormMsg fieldId value) model -> updateField f fieldId value model
    , encodeMsg =
        \(FormMsg fieldId value) ->
            E.object [ ( "fieldId", E.int fieldId ), ( "value", value ) ]
    , decoderMsg = D.map2 FormMsg (D.field "fieldId" D.int) (D.field "value" D.value)
    , encodeModel = \(FormState { values }) -> E.dict fromInt identity values
    , decoderModel = formStateDecoder
    }


formStateDecoder : Decoder FormState
formStateDecoder =
    D.dict D.value
        |> D.andThen (\d -> D.succeed <| FormState { values = keysToInt d, parentDomId = "" })


keysToInt : Dict String v -> Dict Int v
keysToInt d =
    Dict.toList d
        |> List.map (\( k, v ) -> ( withDefault -1 (toInt k), v ))
        |> Dict.fromList


extract : { a | fn : { b | combine : c -> d } } -> c -> d
extract { fn } formState =
    fn.combine formState
