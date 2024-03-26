module Form exposing (..)

import Dict exposing (Dict)
import Html exposing (Html, button, div, span, text)
import Html.Events exposing (onClick)
import Json.Decode as D exposing (Decoder, Error(..))
import Json.Encode as E exposing (Value)
import Maybe exposing (withDefault)
import String exposing (fromInt, toInt)
import Tuple exposing (first)


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
debugFormState ((FormState { values }) as fs) =
    let
        dbg =
            \k v -> Debug.log k (E.encode -1 v)

        _ =
            Dict.map dbg values
    in
    fs


init : Form data customError -> FormState
init { defaults } =
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
        fieldId =
            fromInt count
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


type alias Variant a =
    { value : a
    , id : String
    , label : String
    }


type alias Variants a =
    ( Variant a, List (Variant a) )


fieldWithVariants :
    (Variants String -> Widget String msg String customError)
    -> List ( String, Widget widgetModel msg2 value customError )
    -> FormInternal (Field value customError -> c) customError data
    -> FormInternal c customError data
fieldWithVariants variantSelector variantsWithWidgets { fn, count, updates, fieldWithErrors, validator, defaults } =
    case variantsWithWidgets of
        [] ->
            Debug.todo "How to handle empty list of variants?"

        first :: rest ->
            let
                mkVar tpl =
                    { value = Tuple.first tpl
                    , id = Tuple.first tpl
                    , label = Tuple.first tpl
                    }

                variants : Variants String
                variants =
                    ( mkVar first
                    , List.map mkVar rest
                    )

                selectorWidget : Widget String msg String customError
                selectorWidget =
                    variantSelector variants

                fieldId =
                    fromInt count

                widget : Widget VariantWidgetModel VariantWidgetMsg value customError
                widget =
                    variantWidget selectorWidget (Tuple.first first) variantsWithWidgets

                field_ : Field value customError
                field_ = mkField fieldWithErrors fieldId widget
            in
            { fn = fn field_
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



{-
   mkVariantWidget :
       Widget FormState msg String customError
       -> List (String, Widget widgetModel msg2 value customError)
       -> Widget FormState Msg value customError
   mkVariantWidget selectWidgets variantWidgets =
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
-}


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



{-
   listField :
     Widget widgetModel msg value customError
     -> FormInternal (Field value customError -> c) customError (List data)
     -> FormInternal c customError (List data)
-}


listField listWithAddButton fieldWithRemoveButton widget { fn, count, updates, fieldWithErrors, validator, defaults } =
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
    case ( operation, subfieldId ) of
        ( Add, ArrayElement i ) ->
            D.decodeValue (D.list decoderModel) modelVal
                |> Result.toMaybe
                |> Maybe.withDefault []
                |> (\list ->
                        list
                            ++ [ Debug.log "adding" widget.init ]
                            |> E.list encodeModel
                   )

        ( Remove, ArrayElement i ) ->
            D.decodeValue (D.list decoderModel) modelVal
                |> Result.toMaybe
                |> Maybe.withDefault []
                |> (\list -> List.take i list ++ List.drop (i + 1) list)
                |> E.list encodeModel

        ( Update msgVal, _ ) ->
            case ( D.decodeValue decoderMsg msgVal, D.decodeValue decodeSubfield modelVal ) of
                ( Ok msg, Ok model ) ->
                    widget.update (Debug.log "sg" msg) model |> encodeSubfield

                ( Ok msg, e ) ->
                    widget.update msg widget.init |> encodeSubfield

                ( e1, e2 ) ->
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


type VariantWidgetMsg
    = ForVariantSelect Value
    | ForVariant String Value


type alias VariantWidgetModel =
    { state : FormState
    }


variantWidget :
    Widget String msg String customError
    -> String
    -> List ( String, Widget widgetModel msg2 value customError )
    -> Widget VariantWidgetModel VariantWidgetMsg value customError
variantWidget variantSelector defaultVariantName variantWidgets =
    { init = variantWidgetInit defaultVariantName variantWidgets
    , value = vWselectedValue variantSelector variantWidgets
    , validate = alwaysValid
    , view = vWview variantSelector variantWidgets
    , update = vWupdate variantSelector variantWidgets
    , encodeMsg = vWencodeMsg
    , decoderMsg = vWdecoderMsg
    , encodeModel = \{ state } -> formStateEncode state
    , decoderModel = formStateDecoder |> D.andThen (\d -> D.succeed <| { state = d })
    }


vWbyName :
    List ( String, Widget widgetModel msg2 value customError )
    -> String
    -> Maybe (Widget widgetModel msg2 value customError)
vWbyName variantWidgets variantName =
    List.filter
        (\( name, _ ) -> name == variantName)
        variantWidgets
        |> List.map (\( _, widget ) -> widget)
        |> List.head


vWupdate :
    Widget String msg String customError
    -> List ( String, Widget widgetModel msg2 value customError )
    -> VariantWidgetMsg
    -> VariantWidgetModel
    -> VariantWidgetModel
vWupdate variantSelector variantWidgets msg model =
    case msg of
        ForVariant variantName subMsgVal ->
            case vWbyName variantWidgets variantName of
                Nothing ->
                    model

                Just subWidget ->
                    let
                        subModel_ =
                            read variantName model.state
                                |> D.decodeValue subWidget.decoderModel

                        subMsg_ =
                            D.decodeValue subWidget.decoderMsg subMsgVal
                    in
                    case ( subModel_, subMsg_ ) of
                        ( Ok subModel, Ok subMsg ) ->
                            let
                                values =
                                    Dict.insert variantName
                                        (subWidget.encodeModel <| subWidget.update subMsg subModel)
                                        state_.values

                                (FormState state_) =
                                    model.state

                                state =
                                    FormState { state_ | values = values }
                            in
                            { model | state = state }

                        _ ->
                            model

        ForVariantSelect subMsgVal ->
            let
                selectorValue =
                    read vWselectorFieldId model.state

                decodedSelectorModel =
                    D.decodeValue variantSelector.decoderModel selectorValue

                decodedSelectorMsg =
                    D.decodeValue variantSelector.decoderMsg subMsgVal

                values =
                    case ( decodedSelectorModel, decodedSelectorMsg ) of
                        ( Ok subMsg, Ok subModel ) ->
                            Dict.insert vWselectorFieldId
                                (variantSelector.encodeModel <| variantSelector.update subModel subMsg)
                                state_.values

                        ( e1, e2 ) ->
                            let
                                _ =
                                    Debug.log "could not decode submodel or submsg" ( e1, e2 )
                            in
                            state_.values

                (FormState state_) =
                    model.state

                state =
                    FormState { state_ | values = values }
            in
            { model | state = state }


vWdecoderMsg : Decoder VariantWidgetMsg
vWdecoderMsg =
    D.field "kind" D.string
        |> D.andThen
            (\kind ->
                case kind of
                    "ForVariantSelect" ->
                        D.map ForVariantSelect
                            (D.field "value" D.value)

                    "ForVariant" ->
                        D.map2 ForVariant
                            (D.field "variantName" D.string)
                            (D.field "value" D.value)

                    _ ->
                        D.fail "unknown kind"
            )


vWencodeMsg : VariantWidgetMsg -> Value
vWencodeMsg msg =
    case msg of
        ForVariantSelect v ->
            E.object
                [ ( "kind", E.string "ForVariantSelect" )
                , ( "value", v )
                ]

        ForVariant variantName v ->
            E.object
                [ ( "kind", E.string "ForVariant" )
                , ( "variantName", E.string variantName )
                , ( "value", v )
                ]


variantWidgetInit :
    String
    -> List ( String, Widget widgetModel msg2 value customError )
    -> VariantWidgetModel
variantWidgetInit default variantWidgets =
    let
        values =
            Dict.singleton vWselectorFieldId (E.string default)

        variantInit ( variantName, variantW ) dict =
            variantW.init
                |> variantW.encodeModel
                |> (\v -> Dict.insert variantName v dict)

        values_ =
            List.foldl variantInit values variantWidgets
    in
    { state = FormState { parentDomId = "0", values = values_ } }


vWselectorFieldId : FieldId
vWselectorFieldId =
    "selectorValue"


vWdeserializeModel :
    Widget String msg String customError
    -> FormState
    -> String
vWdeserializeModel widget formState =
    D.decodeValue widget.decoderModel (read vWselectorFieldId formState)
        |> Result.toMaybe
        |> withDefault widget.init


vWvalue :
    Widget String msg String customError
    -> VariantWidgetModel
    -> String
vWvalue widget { state } =
    vWdeserializeModel widget state
        |> widget.value

vWselectedValue : 
    Widget String msg String customError
     -> List ( String, Widget widgetModel msg2 value customError )
     -> VariantWidgetModel -> value
vWselectedValue variantSelectWidget variantWidgets model =
   let
       selectedVariantName = (vWvalue variantSelectWidget model)
       selectedWidget = 
            variantWidgets
            |> List.filter (\( name, _ ) -> name == selectedVariantName) 
               |> List.head
   in
        case selectedWidget of
            Just (_, widget)  ->
                let
                    decodedValue =
                        read selectedVariantName model.state
                        |> D.decodeValue widget.decoderModel 
                in
                    case decodedValue of
                        Ok v -> widget.value v
                        Err _ ->
                            widget.value widget.init
            Nothing ->
                Debug.todo "selected variant not found"

vWview :
    Widget String msg String customError
    -> List ( String, Widget widgetModel msg2 value customError )
    -> DomId
    -> VariantWidgetModel
    -> List (Html VariantWidgetMsg)
vWview variantSelectWidget variantWidgets domId model =
    let
        variantView : ( String, Widget widgetModel msg2 value customError ) -> List (Html VariantWidgetMsg)
        variantView ( variantName, variantW ) =
            case D.decodeValue variantW.decoderModel <| read variantName model.state of
                Ok variantModel ->
                    variantW.view (domId ++ variantName) variantModel
                        |> List.map (\html -> Html.map (\m -> ForVariant variantName <| variantW.encodeMsg m) html)

                Err _ ->
                    [ text "something went wrong" ]
        selectedVariantName = (vWvalue variantSelectWidget model)
    in
    ((variantSelectWidget.view "todo" selectedVariantName)
        |> List.map (Html.map (\msg -> ForVariantSelect <| variantSelectWidget.encodeMsg msg)))
        ++ (List.concat  <| List.map variantView <| List.filter (\( name, _ ) -> name == selectedVariantName) variantWidgets)
