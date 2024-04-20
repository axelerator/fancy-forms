module FancyForms.Form exposing
    ( Form, form, field, isValid, validate, FieldWithErrors, PartialForm
    , Msg, init, update, render, extract
    , listField, FieldWithRemoveButton, ListWithAddButton
    , fieldWithVariants, Variant, Variants
    , toWidget, wrap
    )

{-| FancyForms is a library for building forms in Elm. It is designed with the following goals in mind:

1.  **Type saftey**: Data collected in the forms will be returned directly into a user provided type.
2.  **Ease of use**: No matter how complex the form is, it will only need **one** `Msg` and **one** field on the model.
3.  **Customization**: Users can provide their own widgets and custom validations.
4.  **CSS Agnostic**: Adapts to any CSS framework.
5.  **Composable**: Smaller forms can be combined into larger forms.
6.  **I18n**: Internationalization is supported by avoiding hard coded strings.


# Definition

@docs Form, form, field, isValid, validate, FieldWithErrors, PartialForm


# Wiring

@docs Msg, init, update, render, extract


# List fields

@docs listField, FieldWithRemoveButton, ListWithAddButton


# Fields with Variants

@docs fieldWithVariants, Variant, Variants


# Composition

@docs toWidget, wrap

-}

import Dict exposing (Dict)
import FancyForms.FormState as FormState exposing (DomId, Effect(..), Error(..), FieldId, FieldOperation(..), FieldStatus(..), FormState(..), SubfieldId(..), Validator, Widget, blurAll, blurChildren, formStateDecoder, formStateEncode, justChanged, noAttributes, read, updateFieldStatus, wasAtLeast, write)
import FancyForms.Widgets.VariantSelect exposing (variantWidget, variantWidgetInit)
import Html exposing (Html)
import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)
import List.Nonempty exposing (ListNonempty)
import Maybe exposing (withDefault)
import String exposing (fromInt, toInt)
import Tuple


{-| The message type for the form.
-}
type Msg
    = FormMsg FieldId SubfieldId FieldOperation


{-| Takes the following three arguments to display a form:

1.  a function to turn the forms messages into a `Msg` of the application.

2.  the form

3.  the current state of the form

    type Msg = ... | ForForm Form.Msg | ...
    type alias Model = { ... , formState : FormState, .. }
    myForm = Form.form ...

    view model =
    div [] <| Form.render ForForm myForm model.formState

-}
render : (Msg -> msg) -> Form a customError -> FormState -> List (Html msg)
render toMsg form_ formState =
    form_.fn.combine formState
        |> form_.validator
        |> addInvalidIfInconsistent form_ formState
        |> form_.fn.view formState
        |> List.map (Html.map toMsg)


addInvalidIfInconsistent : Form a customError -> FormState -> List (Error customError) -> List (Error customError)
addInvalidIfInconsistent form_ formState errors =
    if form_.isConsistent formState then
        errors

    else
        NotValid :: errors



{-
   Calulates a new form state based on the current form state and a message

       type Msg = ... | ForForm Form.Msg | ...
       type alias Model = { ... , formState : FormState, .. }

       myForm = Form.form ...

       update : Msg -> Model -> (Model, Cmd Msg)
       update msg model =
           case msg of
               ForForm formMsg ->
                   ( { model | formState = Form.update myForm formMsg model.formState }
                   , Cmd.none
                   )
-}


{-| Updates the form state based on the form message.
-}
update : Form a customError -> Msg -> FormState -> FormState
update form_ (FormMsg fieldId subfieldId op) formState =
    updateField form_ fieldId subfieldId op formState


updateField : PartialForm a customError data -> FieldId -> SubfieldId -> FieldOperation -> FormState -> FormState
updateField { updates } fieldId subfieldId operation ((FormState formState) as fs) =
    let
        updateFn : SubfieldId -> FieldOperation -> Value -> ( Value, Effect )
        updateFn =
            Dict.get fieldId updates
                |> withDefault (\_ _ modelValue_ -> ( modelValue_, NoEffect ))

        modelValue =
            read fieldId fs

        ( updatedModelValue, effect ) =
            updateFn subfieldId operation modelValue

        fieldStatus =
            let
                currentStatus =
                    case Dict.get fieldId formState.fieldStatus of
                        Nothing ->
                            NotVisited

                        Just status ->
                            status
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
        deserializeModel : FormState -> Maybe model
        deserializeModel formState =
            D.decodeValue widget.decoderModel (read fieldId formState)
                |> Result.toMaybe

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

                widgetModel : Maybe model
                widgetModel =
                    deserializeModel formState

                innerAttrs : List (Html.Attribute msg)
                innerAttrs =
                    widgetModel
                        |> Maybe.map widget.value
                        |> Maybe.map (\v -> widget.innerAttributes fieldErrors v)
                        |> Maybe.withDefault []

                inputHtml : List (Html Msg)
                inputHtml =
                    widgetModel
                        |> Maybe.map (widget.view (parentDomId ++ "f-" ++ fieldId) innerAttrs)
                        |> Maybe.withDefault []
                        |> List.map (Html.map toMsg)
            in
            fieldWithErrors fieldErrors inputHtml

        value : FormState -> value
        value formState =
            deserializeModel formState
                |> Maybe.map widget.value
                |> Maybe.withDefault widget.default

        errors_ : FormState -> List (Error customError)
        errors_ formState =
            deserializeModel formState
                |> Maybe.map widget.value
                |> Maybe.map widget.validate
                |> Maybe.withDefault []
    in
    { id = fieldId
    , value = value
    , errors = errors_
    , view = viewField
    , multiple = False
    }


{-| A form that collects a value of type `data` and potentially produces errors of type `customError`.
-}
type alias Form data customError =
    PartialForm
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


{-| Initializes a form state with the default values
-}
init : Form data customError -> data -> FormState
init { domId, initWithData } data =
    FormState.init Dict.empty domId
        |> initWithData data


{-| Represents a form that still needs it's fields to be declared.
Once all the fields that the view function consumes are declared it
is not "partial" anymore.
-}
type alias PartialForm f customError data =
    { fn : f
    , count : Int
    , updates : Dict FieldId (SubfieldId -> FieldOperation -> Value -> ( Value, Effect ))
    , fieldWithErrors : FieldWithErrors customError
    , validator : Validator data customError
    , blur : FormState -> FormState
    , domId : DomId
    , isConsistent : FormState -> Bool
    , initWithData : data -> FormState -> FormState
    }


isConsistentTmp : PartialForm f customError data -> FormState -> Bool
isConsistentTmp { isConsistent } formState =
    isConsistent formState


extractConsistencyCheck : Widget model msg value customError -> FieldId -> FormState -> Bool
extractConsistencyCheck widget fieldId formState =
    read fieldId formState
        |> D.decodeValue widget.decoderModel
        |> Result.map (\model -> widget.isConsistent model && (List.isEmpty <| widget.validate <| widget.value model))
        |> Result.withDefault False


extendConsistencyCheck : (FormState -> Bool) -> (FormState -> Bool) -> FormState -> Bool
extendConsistencyCheck previousChecks newCheck formState =
    previousChecks formState
        && newCheck formState


extractInit : Widget model msg value customError -> FieldId -> (formModel -> value) -> formModel -> FormState -> FormState
extractInit widget fieldId valueExtractor formModel formState =
    let
        value : value
        value =
            valueExtractor formModel

        encodedValue : Value
        encodedValue =
            widget.init value
                |> widget.encodeModel
    in
    write fieldId SingleValue formState encodedValue


extractListInit : Widget model msg value customError -> FieldId -> (formModel -> List value) -> formModel -> FormState -> FormState
extractListInit widget fieldId valueExtractor formModel formState =
    let
        values : List value
        values =
            valueExtractor formModel

        encodedValues : List Value
        encodedValues =
            values
                |> List.map widget.init
                |> List.map widget.encodeModel

        encodedListValue : Value
        encodedListValue =
            E.list identity encodedValues
    in
    write fieldId SingleValue formState encodedListValue


extractVariantInit :
    List.Nonempty.ListNonempty ( String, Widget model msg value customError )
    -> FieldId
    -> (value -> ( String, value ))
    -> value
    -> FormState
    -> FormState
extractVariantInit variantsWithWidgets fieldId valueExtractor formModel formState =
    let
        ( variantName, value ) =
            valueExtractor formModel

        variantNameExtractor : value -> String
        variantNameExtractor v =
            let
                ( variantName_, _ ) =
                    valueExtractor v
            in
            variantName_

        encodedValue : Value
        encodedValue =
            variantWidgetInit variantsWithWidgets variantNameExtractor value
                |> FormState.formStateEncode
    in
    debugFormState <| write fieldId SingleValue formState encodedValue


extendInit : (data -> FormState -> FormState) -> (data -> FormState -> FormState) -> data -> FormState -> FormState
extendInit previousInit nextInit data formState =
    previousInit data formState
        |> nextInit data


{-| A function that recieves the markup of a field and combines with a list of errors.
-}
type alias FieldWithErrors customError =
    List (Error customError) -> List (Html Msg) -> List (Html Msg)


{-| A function that recieves the markup of a list item and combines it with a butoon to remive it from the List.
-}
type alias FieldWithRemoveButton msg =
    msg -> List (Html msg) -> List (Html msg)


{-| A function that recieves the markup of a field and combines it with a button to add a new item.
-}
type alias ListWithAddButton msg =
    msg -> List (Html msg) -> List (Html msg)


{-| Defines a new form that fields can be added to.
Takes four arguments:
1, A unique id for the form to be used as id in the DOM

1.  A validator function that takes the form data and returns a list of errors

2.  A function that receives the fields and returns the `view` and `combine` functions

3.  A function that receives the markup of a field and combines it with a list of errors

        myForm : Form Int ()
        myForm =
            Form.form
                (\errors_ html -> html)
                (\data -> [])
                "minimal-example"
                (\amount ->
                    { view = \formState _ -> amount.view formState
                    , combine = \formState -> amount.value formState
                    }
                )
                |> field (integerInput [])

-}
form : FieldWithErrors customError -> Validator data customError -> DomId -> a -> PartialForm a customError data
form fieldWithErrors validator domId fn =
    { fn = fn
    , count = 0
    , updates = Dict.empty
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , blur = blurAll
    , domId = domId
    , isConsistent = \_ -> True
    , initWithData = \_ fs -> fs
    }


default : a -> ignored -> a
default a _ =
    a


{-| Adds a new field with the given widget to the form
-}
field :
    (data -> value)
    -> Widget widgetModel msg value customError
    -> PartialForm (Field value customError -> c) customError data
    -> PartialForm c customError data
field extractDefault widget { fn, count, updates, fieldWithErrors, validator, blur, domId, isConsistent, initWithData } =
    let
        fieldId =
            fromInt count
    in
    { fn = fn (mkField fieldWithErrors fieldId widget)
    , count = count + 1
    , updates =
        Dict.insert
            fieldId
            (encodedUpdate widget Nothing)
            updates
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , blur = blur >> blurChildren fieldId widget
    , domId = domId
    , isConsistent = extendConsistencyCheck isConsistent (extractConsistencyCheck widget fieldId)
    , initWithData =
        extendInit
            initWithData
            (extractInit widget fieldId extractDefault)
    }


{-| A variant for widgets with a "select" notion.
-}
type alias Variant a =
    { value : a
    , id : String
    , label : String
    }


{-| A nonempty list of variants.
-}
type alias Variants a =
    ListNonempty (Variant a)


{-| Adds a new field to with different variants to the form.
Each variant is represented by a label and a sub form.

The function takes the following arguments:

1.  A widget to select the variant
2.  The default variant
3.  A list of other variants

-}
fieldWithVariants :
    (Variants String -> Widget String msg String customError)
    -> ( String, Form data customError )
    -> List ( String, Form data customError )
    -> (data -> ( String, data ))
    -> PartialForm (Field data customError -> c) customError data
    -> PartialForm c customError data
fieldWithVariants variantSelector defaultVariant otherVariants extractDefault { fn, count, updates, fieldWithErrors, validator, blur, domId, isConsistent, initWithData } =
    let
        toWidgetVariant ( n, f ) =
            ( n, toWidget f )

        variantsWithWidgets =
            ( defaultVariant |> toWidgetVariant
            , otherVariants |> List.map toWidgetVariant
            )

        mkVariant ( name, _ ) =
            { value = name
            , id = name
            , label = name
            }

        fieldId =
            fromInt count

        variantNameExtractor data =
            extractDefault data |> Tuple.first

        widget =
            variantWidget
                (variantSelector <| List.Nonempty.map mkVariant variantsWithWidgets)
                variantNameExtractor
                (Tuple.first <| List.Nonempty.head variantsWithWidgets)
                variantsWithWidgets
    in
    { fn = fn <| mkField fieldWithErrors fieldId widget
    , count = count + 1
    , updates =
        Dict.insert
            fieldId
            (encodedUpdate widget Nothing)
            updates
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , blur = blur >> blurChildren fieldId widget
    , domId = domId
    , isConsistent = extendConsistencyCheck isConsistent (extractConsistencyCheck widget fieldId)
    , initWithData =
        extendInit
            initWithData
            (extractVariantInit variantsWithWidgets fieldId extractDefault)
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
                        []
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
                |> List.map widget.value
                |> List.map widget.validate
                |> List.concat
    in
    { id = fieldId
    , value = value
    , errors = errors_
    , view = viewField
    , multiple = True
    }


{-| Adds a field to the form where the user can add and remove elements.

The first argument is a `ListWithAddButton` function that cobines the inout list with a button to add a new element.

The second argument is a `FieldWithRemoveButton` function that combines one item with a button to remove it.

The third argument is the widget to use for each element in the list.

-}
listField :
    ListWithAddButton Msg
    -> FieldWithRemoveButton Msg
    -> value
    -> (data -> List value)
    -> Widget model msg value customError
    ->
        { a
            | fn : Field (List value) customError -> b
            , count : Int
            , updates : Dict String (SubfieldId -> FieldOperation -> Value -> ( Value, Effect ))
            , fieldWithErrors : FieldWithErrors customError
            , validator : e
            , blur : c -> FormState
            , domId : DomId
            , isConsistent : FormState -> Bool
            , initWithData : data -> FormState -> FormState
        }
    ->
        { fn : b
        , count : Int
        , updates : Dict String (SubfieldId -> FieldOperation -> Value -> ( Value, Effect ))
        , fieldWithErrors : FieldWithErrors customError
        , validator : e
        , blur : c -> FormState
        , domId : DomId
        , isConsistent : FormState -> Bool
        , initWithData : data -> FormState -> FormState
        }
listField listWithAddButton fieldWithRemoveButton template extractDefault widget { fn, count, updates, fieldWithErrors, validator, blur, domId, isConsistent, initWithData } =
    let
        fieldId =
            fromInt count
    in
    { fn = fn (mkListField fieldWithErrors listWithAddButton fieldWithRemoveButton fieldId widget)
    , count = count + 1
    , updates =
        Dict.insert
            (fromInt count)
            (encodedUpdate widget (Just template))
            updates
    , fieldWithErrors = fieldWithErrors
    , validator = validator
    , blur = blur >> blurChildren fieldId widget
    , domId = domId
    , isConsistent = extendConsistencyCheck isConsistent (extractConsistencyCheck widget fieldId)
    , initWithData =
        extendInit
            initWithData
            (extractListInit widget fieldId extractDefault)
    }


{-| Creates a new `Widget` that's decorated with the given function.
-}
wrap :
    Widget widgetModel msg value customError
    -> (DomId -> List (Html msg) -> List (Html msg))
    -> Widget widgetModel msg value customError
wrap widget container =
    { widget
        | view = \domId innerAttrs model -> container domId <| widget.view domId innerAttrs model
    }


encodedUpdate :
    Widget model msg value customError
    -> Maybe value
    -> SubfieldId
    -> FieldOperation
    -> Value
    -> ( Value, Effect )
encodedUpdate ({ decoderMsg, decoderModel, encodeModel } as widget) mbTemplate subfieldId operation modelVal =
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
            ( D.decodeValue (D.list decoderModel) modelVal
                |> Result.withDefault []
                |> (\list ->
                        list
                            ++ [ widget.init <| withDefault widget.default mbTemplate ]
                            |> E.list encodeModel
                   )
            , WasChanged
            )

        ( Remove, ArrayElement i ) ->
            ( D.decodeValue (D.list decoderModel) modelVal
                |> Result.withDefault []
                |> (\list -> List.take i list ++ List.drop (i + 1) list)
                |> E.list encodeModel
            , WasChanged
            )

        ( Update msgVal, _ ) ->
            case ( D.decodeValue decoderMsg msgVal, D.decodeValue decodeSubfield modelVal ) of
                ( Ok msg, Ok model ) ->
                    let
                        updateResult =
                            widget.update msg model
                    in
                    ( encodeSubfield updateResult.model
                    , updateResult.effect
                    )

                ( Ok msg, _ ) ->
                    let
                        updateResult =
                            widget.update msg (widget.init widget.default)
                    in
                    ( encodeSubfield updateResult.model
                    , updateResult.effect
                    )

                _ ->
                    ( modelVal
                    , NoEffect
                    )

        _ ->
            ( modelVal
            , NoEffect
            )


{-| Converts a form to a widget.
-}
toWidget : Form a customError -> Widget FormState Msg a customError
toWidget f =
    let
        value_ : FormState -> a
        value_ formState =
            f.fn.combine formState
    in
    { init = \data -> init f data
    , value = value_
    , default = f.fn.combine <| FormState.init Dict.empty ""
    , validate = f.validator
    , isConsistent = f.isConsistent
    , view =
        \domId innerAttrs ((FormState model) as fs) ->
            f.fn.view (FormState { model | parentDomId = domId }) (f.validator <| value_ fs)
    , update =
        \(FormMsg fieldId subfieldId value) model ->
            updateField f fieldId subfieldId value model |> justChanged
    , encodeMsg = encodeFormMsg
    , decoderMsg =
        decoderFormMsg
            |> D.andThen
                (\((FormMsg fieldId subfieldId fieldOperation) as m) ->
                    D.succeed m
                )
    , encodeModel = formStateEncode
    , decoderModel = formStateDecoder
    , blur = blurAll
    , innerAttributes = noAttributes
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


{-| Adds a validator to a widget.
-}
validate :
    List (Validator value customError)
    -> Widget model msg value customError
    -> Widget model msg value customError
validate validators widget =
    { widget | validate = concatValidators validators }


concatValidators : List (Validator model customError) -> Validator model customError
concatValidators validators model =
    validators
        |> List.map (\validator -> validator model)
        |> List.concat


{-| Returns the result of the `combine` function aka the current state of the form.
-}
extract : Form data customError -> FormState -> data
extract { fn } =
    fn.combine


{-| Returns true if the data entered in the form is valid
-}
isValid : Form data customError -> FormState -> Bool
isValid ({ fn, validator } as form_) formState =
    fn.combine formState
        |> validator
        |> addInvalidIfInconsistent form_ formState
        |> List.isEmpty
