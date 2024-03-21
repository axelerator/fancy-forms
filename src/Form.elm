module Form exposing (..)

import Dict exposing (Dict)
import Html exposing (Html, button, div, text)
import Json.Decode as D exposing (Decoder, Error(..))
import Json.Encode as E exposing (Value)
import Maybe exposing (withDefault)
import String exposing (fromInt, toInt)
import Html.Events exposing (onClick)
import Html exposing (span)


type Msg
    = FormMsg FieldId SubfieldId FieldOperation


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
        updateFn : SubfieldId -> FieldOperation -> Value -> Value
        updateFn =
            Dict.get fieldId updates
                |> withDefault (\_ _ modelValue_ -> modelValue_)

        modelValue =
            read fieldId fs

        _ =
            Debug.log "before, after" ( E.encode -1 modelValue, E.encode -1 updatedModelValue )

        updatedModelValue =
            updateFn subfieldId operation modelValue
    in
    FormState { formState | values = Dict.insert fieldId updatedModelValue formState.values }


type alias FieldId =
    String


type FormState
    = FormState
        { parentDomId : DomId
        , values : Dict FieldId Value
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
                |> Result.toMaybe
                |> withDefault widget.init

        viewField : FormState -> List (Html Msg)
        viewField ((FormState { parentDomId }) as formState) =
            let
                toMsg : msg -> Msg
                toMsg msg =
                    widget.encodeMsg msg
                        |> (\v -> FormMsg fieldId SingleValue (Update v))

                fieldErrors =
                    errors_ formState

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


toKey : FieldId -> SubfieldId -> String
toKey fieldId subfieldId =
    case subfieldId of
        SingleValue ->
            fieldId

        ArrayElement i ->
            fieldId ++ "-" ++ fromInt i


write : FieldId -> SubfieldId -> Value -> FormState -> FormState
write fieldId subfieldId value (FormState formState) =
    FormState
        { formState
            | values =
                Dict.insert (toKey fieldId subfieldId) value formState.values
        }


read : FieldId -> FormState -> Value
read fieldId (FormState { values }) =
    values
        |> Dict.get fieldId
        |> withDefault (E.object [])


type alias Form data customError =
    FormInternal
        { view : FormState -> List (Error customError) -> List (Html Msg)
        , combine : FormState -> data
        }
        customError
        data

debugFormState : FormState -> FormState
debugFormState ((FormState {values}) as fs) =
    let
        dbg = (\k v -> Debug.log k (E.encode -1 v))
        _ = Dict.map dbg values
        
    in
        fs


init : Form data customError -> FormState
init {defaults} = 
    FormState
        { parentDomId = ""
        , values = defaults
        }

type alias FormInternal f customError data =
    { fn : f
    , count : Int
    , updates : Dict FieldId (SubfieldId -> FieldOperation -> Value -> Value)
    , fieldWithErrors : FieldWithErrors customError
    , validator : Validator data customError
    , defaults : Dict FieldId Value
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
    }


field :
    Widget widgetModel msg value customError
    -> FormInternal (Field value customError -> c) customError data
    -> FormInternal c customError data
field widget { fn, count, updates, fieldWithErrors, validator, defaults } =
    let
        fieldId = (fromInt count)
    in
    
    { fn = fn (mkField fieldWithErrors fieldId widget)
    , count = count + 1
    , updates =
        Dict.insert
            (fromInt count)
            (encodedUpdate widget)
            updates
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , defaults = Dict.insert fieldId (widget.encodeModel widget.init) defaults
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
                |> Result.toMaybe
                |> withDefault []

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
                    errors_ formState

                removeArrayElementMsg : Int -> Msg
                removeArrayElementMsg x =
                    FormMsg fieldId (ArrayElement x) Remove

                arrayElementHtml : Int -> model -> List (Html msg)
                arrayElementHtml i model =
                    (widget.view
                        (buildDomId parentDomId fieldId (ArrayElement i))
                        model)
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
            fieldWithErrors fieldErrors ( addArrayElement inputHtml )

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



{-
listField :
  Widget widgetModel msg value customError
  -> FormInternal (Field value customError -> c) customError (List data)
  -> FormInternal c customError (List data)
-}
listField listWithAddButton fieldWithRemoveButton widget { fn, count, updates, fieldWithErrors, validator, defaults } =
    let 
        fieldId = (fromInt count)
    in
    { fn = fn (mkListField fieldWithErrors listWithAddButton  fieldWithRemoveButton fieldId widget)
    , count = count + 1
    , updates =
        Dict.insert
            (fromInt count)
            (encodedUpdate widget)
            updates
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , defaults = Dict.insert fieldId (E.list widget.encodeModel [widget.init]) defaults
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
    -> Value
encodedUpdate ({ decoderMsg, decoderModel, encodeModel } as widget) subfieldId operation modelVal =
    let
        _ = Debug.log "encodedUpdate" <| case operation of
            Add -> "add"
            Remove -> "remove"
            Update uv -> E.encode -1 uv
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
                        |> Result.toMaybe
                        |> Maybe.withDefault (List.repeat (i + 1) widget.init)
                        |> List.indexedMap
                            (\idx e ->
                                if idx == i then
                                    updatedModel

                                else
                                    e
                            )
                        |> E.list encodeModel
    in
    case (operation, subfieldId) of
        (Add, ArrayElement i) ->
            D.decodeValue (D.list decoderModel) modelVal
                |> Result.toMaybe
                |> Maybe.withDefault []
                |> \list -> list ++ [ Debug.log "adding" widget.init ]
                |> E.list encodeModel


        (Remove, ArrayElement i) ->
            D.decodeValue (D.list decoderModel) modelVal
                |> Result.toMaybe
                |> Maybe.withDefault []
                |> (\list -> List.take i list ++ List.drop (i + 1) list)
                |> E.list encodeModel

        (Update msgVal, _) ->
            case ( D.decodeValue decoderMsg msgVal, D.decodeValue decodeSubfield modelVal ) of
                ( Ok msg, Ok model ) ->
                    widget.update (Debug.log "sg" msg) model |> encodeSubfield

                ( Ok msg, e ) ->
                    widget.update msg widget.init |> encodeSubfield

                (e1, e2) ->
                    let
                        _ = Debug.log "invalde" (e1, E.encode -1 msgVal)
                    in
                    modelVal
        _ ->
            let
                _ = Debug.log "unknown operation" operation
            in
            
            modelVal

type alias DomId =
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


toWidget : Form a customError -> Widget FormState Msg a customError
toWidget f =
    let
        widgetErrors formState =
            f.fn.combine formState
                |> f.validator
    in
    { init = FormState { parentDomId = "", values = f.defaults }
    , value = \formState -> f.fn.combine formState
    , validate =
        \formState -> widgetErrors formState
    , view =
        \domId ((FormState model) as fs) ->
            f.fn.view (FormState { model | parentDomId = domId }) (widgetErrors fs)
    , update = \(FormMsg fieldId subfieldId value) model -> updateField f fieldId subfieldId value model
    , encodeMsg = encodeFormMsg
    , decoderMsg = decoderFormMsg
    , encodeModel = formStateEncode
    , decoderModel = formStateDecoder
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

formStateEncode : FormState -> Value
formStateEncode (FormState { values }) =
    E.dict identity identity values

formStateDecoder : Decoder FormState
formStateDecoder =
    D.dict D.value
        |> D.andThen (\d -> D.succeed <| FormState { values = d, parentDomId = "" })


keysToInt : Dict String v -> Dict Int v
keysToInt d =
    Dict.toList d
        |> List.map (\( k, v ) -> ( withDefault -1 (toInt k), v ))
        |> Dict.fromList


type Error customError
    = MustNotBeBlank
    | CustomError customError


type alias Validator a e =
    a -> List (Error e)


alwaysValid : Validator a e
alwaysValid _ =
    []


validate :
    List (Validator model customError)
    -> Widget model msg value customError
    -> Widget model msg value customError
validate validators widget =
    { widget | validate = concatValidators validators }


concatValidators : List (Validator model customError) -> Validator model customError
concatValidators validators model =
    List.map (\validator -> validator model) validators
        |> List.concat


extract : { form | fn : { b | combine : FormState -> data } } -> FormState -> data
extract { fn } =
    fn.combine
