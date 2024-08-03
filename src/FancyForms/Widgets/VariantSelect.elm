module FancyForms.Widgets.VariantSelect exposing (Model, Msg, variantWidget, variantWidgetInit)

import Dict
import FancyForms.FormState exposing (DomId, FieldId, FieldOperation(..), FormState(..), SubfieldId(..), Widget, alwaysValid, blurChildren, encodedUpdate, formStateDecoder, formStateEncode, justChanged, noAttributes, read, subId, write)
import Html exposing (Html, text)
import Json.Decode as D exposing (Decoder, Error(..))
import Json.Encode as E exposing (Value)
import List.Nonempty exposing (Nonempty)
import Maybe exposing (withDefault)


type Msg
    = ForVariantSelect Value
    | ForVariant String Value


type alias Model =
    FormState


variantWidget :
    Widget model msg String customError
    -> (value -> String)
    -> String
    -> Nonempty ( String, Widget widgetModel msg2 value customError )
    -> Widget Model Msg value customError
variantWidget variantSelector variantNameExtractor defaultVariantName variantWidgets =
    { init = variantWidgetInit variantWidgets variantNameExtractor
    , value = selectedValue variantSelector variantWidgets
    , default = List.Nonempty.head variantWidgets |> Tuple.second |> .default
    , validate = alwaysValid -- Delegate: Include validation result of currently selected variant
    , isConsistent = \_ -> True
    , view = view defaultVariantName variantSelector (List.Nonempty.toList variantWidgets)
    , update = \msg model -> update variantSelector variantWidgets msg model |> justChanged
    , encodeMsg = encodeMsg
    , decoderMsg = decoderMsg
    , encodeModel = formStateEncode
    , decoderModel = formStateDecoder
    , blur = blur variantSelector (List.Nonempty.toList variantWidgets)
    , innerAttributes = noAttributes
    }


blur :
    Widget model msg String customError
    -> List ( String, Widget widgetModel msg2 value customError )
    -> Model
    -> Model
blur variantSelector variantWidgets formState =
    let
        withBlurredSelector =
            blurChildren selectorFieldId variantSelector formState

        folder ( fieldId, widget ) fs =
            blurChildren fieldId widget fs
    in
    List.foldl folder withBlurredSelector variantWidgets


widgetByName :
    Nonempty ( String, Widget widgetModel msg2 value customError )
    -> String
    -> Widget widgetModel msg2 value customError
widgetByName variantWidgets variantName =
    variantWidgets
        |> List.Nonempty.toList
        |> List.filter (\( name, _ ) -> name == variantName)
        |> List.map Tuple.second
        |> List.head
        |> withDefault (List.Nonempty.head variantWidgets |> Tuple.second)


update :
    Widget model msg String customError
    -> Nonempty ( String, Widget widgetModel msg2 value customError )
    -> Msg
    -> Model
    -> Model
update variantSelector variantWidgets msg model =
    case msg of
        ForVariant variantName subMsgVal ->
            read variantName model
                |> encodedUpdate (widgetByName variantWidgets variantName) SingleValue (Update subMsgVal)
                |> write variantName SingleValue model

        ForVariantSelect subMsgVal ->
            read selectorFieldId model
                |> encodedUpdate variantSelector SingleValue (Update subMsgVal)
                |> write selectorFieldId SingleValue model


decoderMsg : Decoder Msg
decoderMsg =
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


encodeMsg : Msg -> Value
encodeMsg msg =
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
    Nonempty ( String, Widget widgetModel msg2 value customError )
    -> (value -> String)
    -> value
    -> Model
variantWidgetInit variantWidgets extractVariantName value_ =
    let
        values =
            Dict.singleton selectorFieldId (E.string <| extractVariantName value_)

        variantInit ( variantName, variantW ) dict =
            variantW.init value_
                |> variantW.encodeModel
                |> (\v -> Dict.insert variantName v dict)

        values_ =
            List.Nonempty.toList variantWidgets
                |> List.foldl variantInit values
    in
    FormState { parentDomId = "0", values = values_, fieldStatus = Dict.empty, allBlurred = False }


selectorFieldId : FieldId
selectorFieldId =
    "selectorValue"


value :
    String
    -> Widget model msg String customError
    -> FormState
    -> String
value defaultVariantName widget formState =
    D.decodeValue widget.decoderModel (read selectorFieldId formState)
        |> Result.map widget.value
        |> Result.withDefault defaultVariantName


selectedValue :
    Widget model msg String customError
    -> Nonempty ( String, Widget widgetModel msg2 value customError )
    -> Model
    -> value
selectedValue variantSelectWidget variantWidgets model =
    let
        defaultVariantName =
            List.Nonempty.head variantWidgets |> Tuple.first

        selectedVariantName =
            value defaultVariantName variantSelectWidget model

        selectedWidget =
            variantWidgets
                |> List.Nonempty.toList
                |> List.filter (\( name, _ ) -> name == selectedVariantName)
                |> List.head
                |> withDefault (List.Nonempty.head variantWidgets)
                |> Tuple.second
    in
    read selectedVariantName model
        |> D.decodeValue selectedWidget.decoderModel
        |> Result.map selectedWidget.value
        |> Result.withDefault selectedWidget.default


view :
    String
    -> Widget model msg String customError
    -> List ( String, Widget widgetModel msg2 value customError )
    -> DomId
    -> List (Html.Attribute Msg)
    -> Model
    -> List (Html Msg)
view defaultVariantName variantSelectWidget variantWidgets domId innerAttrs model =
    let
        selectedVariantName : String
        selectedVariantName =
            value defaultVariantName variantSelectWidget model

        variantSelectorHtml : List (Html Msg)
        variantSelectorHtml =
            selectedVariantName
                |> variantSelectWidget.init
                |> variantSelectWidget.view (subId domId selectorFieldId SingleValue) []
                |> List.map (Html.map (\msg -> ForVariantSelect <| variantSelectWidget.encodeMsg msg))

        variantView : ( String, Widget widgetModel msg2 value customError ) -> List (Html Msg)
        variantView ( variantName, variantW ) =
            read variantName model
                |> D.decodeValue variantW.decoderModel
                |> Result.map
                    (\variantModel ->
                        variantW.view (domId ++ variantName) [] variantModel
                            |> List.map (\html -> Html.map (\m -> ForVariant variantName <| variantW.encodeMsg m) html)
                    )
                |> Result.withDefault
                    [ text "Could not decode variant" ]

        variantsHtml : List (Html Msg)
        variantsHtml =
            variantWidgets
                |> List.filter (\( name, _ ) -> name == selectedVariantName)
                |> List.map variantView
                |> List.concat
    in
    variantSelectorHtml ++ variantsHtml
