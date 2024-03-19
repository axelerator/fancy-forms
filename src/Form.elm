module Form exposing (..)

import Dict exposing (Dict)
import Html exposing (Html)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import Maybe exposing (withDefault)
import String exposing (fromInt, toInt)


type Msg
    = FormMsg FieldId Value

render : (Msg -> msg) -> Form a -> FormState -> Html msg
render toMsg f formState =
    f.fn.view formState
        |> Html.map toMsg  


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
    , errors : FormState -> List Error
    , view : FormState -> Html Msg
    }


mkField : (List Error -> Html Msg -> Html Msg) -> FieldId -> Widget model msg value -> Field value
mkField fieldWithErrors fieldId widget =
    let
        deserializeModel : FormState -> model
        deserializeModel formState =
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

                fieldErrors =
                    errors_ formState

                inputHtml =
                    deserializeModel formState
                        |> widget.view (parentDomId ++ "f-" ++ fromInt fieldId)
                        |> Html.map toMsg
            in
            fieldWithErrors fieldErrors inputHtml

        value : FormState -> value
        value formState =
            deserializeModel formState
                |> widget.value

        errors_ : FormState -> List Error
        errors_ formState =
            deserializeModel formState
                |> widget.validate
    in
    { id = fieldId
    , value = value
    , errors = errors_
    , view = viewField
    }


read : FieldId -> FormState -> Value
read fieldId (FormState { values }) =
    Dict.get fieldId values
        |> withDefault (E.object [])


type alias Form data =
    FormInternal
        { view : FormState -> Html Msg
        , combine : FormState -> ( data, Validator data )
        }


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
    , fieldWithErrors : List Error -> Html Msg -> Html Msg
    }


form : (List Error -> Html Msg -> Html Msg) -> a -> FormInternal a
form fieldWithErrors fn =
    { fn = fn
    , count = 0
    , updates = Dict.empty
    , fieldWithErrors = fieldWithErrors
    }


field : Widget widgetModel msg value -> FormInternal (Field value -> c) -> FormInternal c
field widget { fn, count, updates, fieldWithErrors } =
    { fn = fn (mkField fieldWithErrors count widget)
    , count = count + 1
    , updates =
        Dict.insert
            count
            (encodedUpdate widget)
            updates
    , fieldWithErrors = fieldWithErrors
    }


wrap :
    Widget widgetModel msg value
    -> (DomId -> Html msg -> Html msg)
    -> Widget widgetModel msg value
wrap widget container =
    { widget
        | view = \domId model -> container domId <| widget.view domId model
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
    , validate : Validator model
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
    , value = \formState -> f.fn.combine formState |> Tuple.first
    , validate =
        \formState ->
            let
                ( data, validator ) =
                    f.fn.combine formState
            in
            validator data
    , view = \domId (FormState model) -> f.fn.view (FormState { model | parentDomId = domId })
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


type Error
    = MustNotBeBlank


type alias Validator a =
    a -> List Error


alwaysValid : Validator a
alwaysValid _ =
    []


extract : { form | fn : { b | combine : FormState -> ( data, Validator data ) } } -> FormState -> data
extract { fn } =
    Tuple.first << fn.combine


errors : { form | fn : { b | combine : FormState -> ( data, Validator data ) } } -> FormState -> List Error
errors { fn } formState =
    let
        ( data, validator ) =
            fn.combine formState
    in
    validator data
