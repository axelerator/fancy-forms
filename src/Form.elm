module Form exposing (..)

import Dict exposing (Dict)
import FormState exposing (DomId, Error, FieldId, FieldOperation(..), FormState(..), SubfieldId(..), Validator, Widget, formStateDecoder, formStateEncode, read)
import Html exposing (Html)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import List.Nonempty exposing (ListNonempty)
import Maybe exposing (withDefault)
import String exposing (fromInt, toInt)
import Tuple
import Widgets.VariantSelect exposing (variantWidget)
import FormState exposing (justChanged)
import FormState exposing (Effect)
import FormState exposing (Effect(..))
import FormState exposing (FieldStatus(..))
import FormState exposing (updateFieldStatus)
import FormState exposing (wasAtLeast)
import FormState exposing (blurAll)
import FormState exposing (blurChildren)


type Msg
    = FormMsg FieldId SubfieldId FieldOperation


render : (Msg -> msg) -> Form a customError -> FormState -> List (Html msg)
render toMsg form_ formState =
    form_.fn.combine formState
        |> form_.validator
        |> form_.fn.view formState
        |> List.map (Html.map toMsg)


update : Form a customError -> Msg -> FormState -> FormState
update form_ (FormMsg fieldId subfieldId op) formState =
    updateField form_ fieldId subfieldId op formState


updateField : FormInternal a customError data -> FieldId -> SubfieldId -> FieldOperation -> FormState -> FormState
updateField { updates } fieldId subfieldId operation ((FormState formState) as fs) =
    let
        updateFn : SubfieldId -> FieldOperation -> Value -> (Value, Effect)
        updateFn =
            Dict.get fieldId updates
                |> withDefault (\_ _ modelValue_ -> (modelValue_, NoEffect))

        modelValue =
            read fieldId fs

        (updatedModelValue, effect) =
            updateFn subfieldId operation modelValue
        fieldStatus =
            let
                currentStatus =
                    case Dict.get fieldId formState.fieldStatus of
                        Nothing -> NotVisited
                        Just status -> status

            
            in
                Dict.insert fieldId (updateFieldStatus currentStatus effect) formState.fieldStatus
            
    in
    FormState 
        { formState 
        | values = Dict.insert fieldId updatedModelValue formState.values 
        , fieldStatus = fieldStatus
        }


type alias Field a customError =
    { id : FieldId
    , value : FormState -> a
    , errors : FormState -> List (Error customError)
    , view : FormState -> List (Html Msg)
    , multiple : Bool
    }


mkField : FieldWithErrors customError -> FieldId -> Widget model msg value customError -> Field value customError
mkField fieldWithErrors fieldId widget =
    let
        deserializeModel : FormState -> model
        deserializeModel formState =
            D.decodeValue widget.decoderModel (read fieldId formState)
                |> Result.withDefault widget.init

        viewField : FormState -> List (Html Msg)
        viewField ((FormState { parentDomId }) as formState) =
            let
                toMsg : msg -> Msg
                toMsg msg =
                    widget.encodeMsg msg
                        |> (\v -> FormMsg fieldId SingleValue (Update v))


                fieldErrors =
                    if wasAtLeast Blurred fieldId formState then
                        errors_ formState
                    else
                        []


                inputHtml : List (Html Msg)
                inputHtml =
                    deserializeModel formState
                        |> widget.view (parentDomId ++ "f-" ++ fieldId)
                        |> List.map (Html.map toMsg)
            in
            fieldWithErrors fieldErrors inputHtml

        value : FormState -> value
        value formState =
            deserializeModel formState
                |> widget.value

        errors_ : FormState -> List (Error customError)
        errors_ formState =
            deserializeModel formState
                |> widget.validate
    in
    { id = fieldId
    , value = value
    , errors = errors_
    , view = viewField
    , multiple = False
    }


type alias Form data customError =
    FormInternal
        { view : FormState -> List (Error customError) -> List (Html Msg)
        , combine : FormState -> data
        }
        customError
        data


debugFormState : FormState -> FormState
debugFormState ((FormState { values }) as fs) =
    let
        dbg =
            \k v -> Debug.log k (E.encode -1 v)

        _ =
            Dict.map dbg values
    in
    fs


init : Form data customError -> FormState
init { defaults } = FormState.init defaults


type alias FormInternal f customError data =
    { fn : f
    , count : Int
    , updates : Dict FieldId (SubfieldId -> FieldOperation -> Value -> (Value, Effect))
    , fieldWithErrors : FieldWithErrors customError
    , validator : Validator data customError
    , defaults : Dict FieldId Value
    , blur : FormState -> FormState
    }


type alias FieldWithErrors customError =
    List (Error customError) -> List (Html Msg) -> List (Html Msg)


type alias FieldWithRemoveButton msg =
    msg -> List (Html msg) -> List (Html msg)


type alias ListWithAddButton msg =
    msg -> List (Html msg) -> List (Html msg)


form : Validator data customError -> FieldWithErrors customError -> a -> FormInternal a customError data
form validator fieldWithErrors fn =
    { fn = fn
    , count = 0
    , updates = Dict.empty
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , defaults = Dict.empty
    , blur = blurAll
    }

field :
    Widget widgetModel msg value customError
    -> FormInternal (Field value customError -> c) customError data
    -> FormInternal c customError data
field widget { fn, count, updates, fieldWithErrors, validator, defaults, blur } =
    let
        fieldId =
            fromInt count
    in
    { fn = fn (mkField fieldWithErrors fieldId widget)
    , count = count + 1
    , updates =
        Dict.insert
            fieldId
            (encodedUpdate widget)
            updates
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , defaults = Dict.insert fieldId (widget.encodeModel widget.init) defaults
    , blur = blur >> blurChildren fieldId widget
    }

type alias Variant a =
    { value : a
    , id : String
    , label : String
    }


type alias Variants a =
    ListNonempty (Variant a)


fieldWithVariants :
    (Variants String -> Widget String msg String customError)
    -> ( String, Widget widgetModel msg2 value customError )
    -> List ( String, Widget widgetModel msg2 value customError )
    -> FormInternal (Field value customError -> c) customError data
    -> FormInternal c customError data
fieldWithVariants variantSelector defaultVariant otherVariants { fn, count, updates, fieldWithErrors, validator, defaults, blur } =
    let
        variantsWithWidgets =
            ( defaultVariant
            , otherVariants
            )

        mkVariant ( name, _ ) =
            { value = name
            , id = name
            , label = name
            }

        fieldId =
            fromInt count

        widget =
            variantWidget
                (variantSelector <| List.Nonempty.map mkVariant variantsWithWidgets)
                (Tuple.first <| List.Nonempty.head variantsWithWidgets)
                variantsWithWidgets
    in
    { fn = fn <| mkField fieldWithErrors fieldId widget
    , count = count + 1
    , updates =
        Dict.insert
            fieldId
            (encodedUpdate widget)
            updates
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , defaults = Dict.insert fieldId (widget.encodeModel widget.init) defaults
    , blur = blur >> blurChildren fieldId widget
    }


buildDomId : DomId -> FieldId -> SubfieldId -> DomId
buildDomId parentDomId fieldId subfieldId =
    parentDomId
        ++ "-"
        ++ fieldId
        ++ (case subfieldId of
                SingleValue ->
                    ""

                ArrayElement i ->
                    "-" ++ fromInt i
           )


mkListField : FieldWithErrors customError -> ListWithAddButton Msg -> FieldWithRemoveButton Msg -> FieldId -> Widget model msg value customError -> Field (List value) customError
mkListField fieldWithErrors listWithAddButton fieldWithRemoveButton fieldId widget =
    let
        deserializeModel : FormState -> List model
        deserializeModel formState =
            D.decodeValue (D.list widget.decoderModel) (read fieldId formState)
                |> Result.withDefault []

        viewField : FormState -> List (Html Msg)
        viewField ((FormState { parentDomId }) as formState) =
            let
                toMsg_ : Int -> Html msg -> Html Msg
                toMsg_ i html =
                    Html.map (\msg -> FormMsg fieldId (ArrayElement i) (Update (widget.encodeMsg msg))) html

                toMsg : Int -> List (Html msg) -> List (Html Msg)
                toMsg i html =
                    List.map
                        (toMsg_ i)
                        html

                fieldErrors =
                    if wasAtLeast Blurred fieldId formState then
                        errors_ formState
                    else
                        []

                removeArrayElementMsg : Int -> Msg
                removeArrayElementMsg x =
                    FormMsg fieldId (ArrayElement x) Remove

                arrayElementHtml : Int -> model -> List (Html msg)
                arrayElementHtml i model =
                    widget.view
                        (buildDomId parentDomId fieldId (ArrayElement i))
                        model

                addRemoveButton : Int -> List (Html Msg) -> List (Html Msg)
                addRemoveButton i html =
                    fieldWithRemoveButton (removeArrayElementMsg i) html

                inputHtml : List (Html Msg)
                inputHtml =
                    deserializeModel formState
                        |> List.indexedMap arrayElementHtml
                        |> List.indexedMap toMsg
                        |> List.indexedMap addRemoveButton
                        |> List.concat

                addArrayElementMsg =
                    FormMsg fieldId (ArrayElement 0) Add

                addArrayElement : List (Html Msg) -> List (Html Msg)
                addArrayElement html =
                    listWithAddButton addArrayElementMsg html
            in
            fieldWithErrors fieldErrors (addArrayElement inputHtml)

        value : FormState -> List value
        value formState =
            deserializeModel formState
                |> List.map widget.value

        errors_ : FormState -> List (Error customError)
        errors_ formState =
            deserializeModel formState
                |> List.map widget.validate
                |> List.concat
    in
    { id = fieldId
    , value = value
    , errors = errors_
    , view = viewField
    , multiple = True
    }


listField listWithAddButton fieldWithRemoveButton widget { fn, count, updates, fieldWithErrors, validator, defaults, blur } =
    let
        fieldId =
            fromInt count
    in
    { fn = fn (mkListField fieldWithErrors listWithAddButton fieldWithRemoveButton fieldId widget)
    , count = count + 1
    , updates =
        Dict.insert
            (fromInt count)
            (encodedUpdate widget)
            updates
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , defaults = Dict.insert fieldId (E.list widget.encodeModel [ widget.init ]) defaults
    , blur = blur >> blurChildren fieldId widget
    }


wrap :
    Widget widgetModel msg value customError
    -> (DomId -> List (Html msg) -> List (Html msg))
    -> Widget widgetModel msg value customError
wrap widget container =
    { widget
        | view = \domId model -> container domId <| widget.view domId model
    }


encodedUpdate :
    Widget model msg value customError
    -> SubfieldId
    -> FieldOperation
    -> Value
    -> (Value, Effect)
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
            (D.decodeValue (D.list decoderModel) modelVal
                |> Result.withDefault []
                |> (\list ->
                        list
                            ++ [ widget.init ]
                            |> E.list encodeModel
                   )
            , WasChanged
            )

        ( Remove, ArrayElement i ) ->
            (D.decodeValue (D.list decoderModel) modelVal
                |> Result.withDefault []
                |> (\list -> List.take i list ++ List.drop (i + 1) list)
                |> E.list encodeModel
            , WasChanged
            )

        ( Update msgVal, _ ) ->
            case ( D.decodeValue decoderMsg msgVal, D.decodeValue decodeSubfield modelVal ) of
                ( Ok msg, Ok model ) ->
                    let
                        updateResult = widget.update msg model
                    in
                        (encodeSubfield updateResult.model
                        , updateResult.effect
                        )

                ( Ok msg, _ ) ->
                    let
                        updateResult = widget.update msg widget.init
                    in
                    (encodeSubfield updateResult.model
                    , updateResult.effect
                    )

                ( e1, _ ) ->
                    let
                        _ =
                            Debug.log "invalde" ( e1, E.encode -1 msgVal, modelVal )
                    in
                    ( modelVal
                    , NoEffect
                    )

        _ ->
            (modelVal
            , NoEffect
            )


toWidget : Form a customError -> Widget FormState Msg a customError
toWidget f =
    let
        widgetErrors formState =
            f.fn.combine formState
                |> f.validator
    in
    { init = init f
    , value = \formState -> f.fn.combine formState
    , validate =
        \formState -> widgetErrors formState
    , view =
        \domId ((FormState model) as fs) ->
            f.fn.view (FormState { model | parentDomId = domId }) (widgetErrors fs)
    , update = \(FormMsg fieldId subfieldId value) model -> updateField f fieldId subfieldId value model |> justChanged
    , encodeMsg = encodeFormMsg
    , decoderMsg = decoderFormMsg
    , encodeModel = formStateEncode
    , decoderModel = formStateDecoder
    , blur = blurAll
    }

encodeFormMsg : Msg -> Value
encodeFormMsg (FormMsg fieldId subfieldId operation) =
    E.object
        [ ( "fieldId", E.string fieldId )
        , ( "subFieldId", encodeSubFieldId subfieldId )
        , ( "operation", encodeFieldOperation operation )
        ]


decoderFormMsg : Decoder Msg
decoderFormMsg =
    D.map3 FormMsg
        (D.field "fieldId" D.string)
        (D.field "subFieldId" decoderSubFieldId)
        (D.field "operation" decoderFieldOperation)


encodeFieldOperation : FieldOperation -> Value
encodeFieldOperation operation =
    case operation of
        Add ->
            E.object
                [ ( "kind", E.string "add" ) ]

        Remove ->
            E.object
                [ ( "kind", E.string "remove" ) ]

        Update v ->
            E.object
                [ ( "kind", E.string "update" )
                , ( "value", v )
                ]


decoderFieldOperation : Decoder FieldOperation
decoderFieldOperation =
    D.field "kind" D.string
        |> D.andThen
            (\kind ->
                case kind of
                    "add" ->
                        D.succeed Add

                    "remove" ->
                        D.succeed Remove

                    "update" ->
                        D.map Update
                            (D.field "value" D.value)

                    _ ->
                        D.fail "unknown kind"
            )


encodeSubFieldId : SubfieldId -> Value
encodeSubFieldId subfieldId =
    case subfieldId of
        SingleValue ->
            E.null

        ArrayElement i ->
            E.int i


decoderSubFieldId : Decoder SubfieldId
decoderSubFieldId =
    D.oneOf
        [ D.int |> D.andThen (\i -> D.succeed (ArrayElement i))
        , D.null SingleValue
        ]


keysToInt : Dict String v -> Dict Int v
keysToInt d =
    Dict.toList d
        |> List.map (\( k, v ) -> ( withDefault -1 (toInt k), v ))
        |> Dict.fromList


validate :
    List (Validator model customError)
    -> Widget model msg value customError
    -> Widget model msg value customError
validate validators widget =
    { widget | validate = concatValidators validators }


concatValidators : List (Validator model customError) -> Validator model customError
concatValidators validators model =
    validators
    |> List.map (\validator -> validator model) 
    |> List.concat


extract : Form data customError -> FormState -> data
extract { fn } =
    fn.combine
