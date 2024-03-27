module Widgets.VariantSelect exposing (variantWidget)

import Dict
import FormState exposing (DomId, FieldId, FieldOperation(..), FormState(..), SubfieldId(..), Widget, alwaysValid, encodedUpdate, formStateDecoder, formStateEncode, read, subId, write)
import Html exposing (Html, text)
import Json.Decode as D exposing (Decoder, Error(..))
import Json.Encode as E exposing (Value)
import List.Nonempty exposing (ListNonempty)
import Maybe exposing (withDefault)


type Msg
    = ForVariantSelect Value
    | ForVariant String Value


type alias Model =
    FormState


variantWidget :
    Widget String msg String customError
    -> String
    -> ListNonempty ( String, Widget widgetModel msg2 value customError )
    -> Widget Model Msg value customError
variantWidget variantSelector defaultVariantName variantWidgets =
    { init = variantWidgetInit defaultVariantName variantWidgets
    , value = selectedValue variantSelector variantWidgets
    , validate = alwaysValid
    , view = view variantSelector (List.Nonempty.toList variantWidgets)
    , update = update variantSelector variantWidgets
    , encodeMsg = encodeMsg
    , decoderMsg = decoderMsg
    , encodeModel = formStateEncode
    , decoderModel = formStateDecoder
    }


widgetByName :
    ListNonempty ( String, Widget widgetModel msg2 value customError )
    -> String
    -> Widget widgetModel msg2 value customError
widgetByName variantWidgets variantName =
    variantWidgets
        |> List.Nonempty.filter (\( name, _ ) -> name == variantName)
        |> List.map Tuple.second
        |> List.head
        |> withDefault (List.Nonempty.head variantWidgets |> Tuple.second)


update :
    Widget String msg String customError
    -> ListNonempty ( String, Widget widgetModel msg2 value customError )
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
    String
    -> ListNonempty ( String, Widget widgetModel msg2 value customError )
    -> Model
variantWidgetInit default variantWidgets =
    let
        values =
            Dict.singleton selectorFieldId (E.string default)

        variantInit ( variantName, variantW ) dict =
            variantW.init
                |> variantW.encodeModel
                |> (\v -> Dict.insert variantName v dict)

        values_ =
            List.Nonempty.toList variantWidgets
                |> List.foldl variantInit values
    in
    FormState { parentDomId = "0", values = values_, fieldStatus = Dict.empty }


selectorFieldId : FieldId
selectorFieldId =
    "selectorValue"


deserializeModel :
    Widget String msg String customError
    -> FormState
    -> String
deserializeModel widget formState =
    D.decodeValue widget.decoderModel (read selectorFieldId formState)
        |> Result.toMaybe
        |> withDefault widget.init


value :
    Widget String msg String customError
    -> Model
    -> String
value widget state =
    deserializeModel widget state
        |> widget.value


selectedValue :
    Widget String msg String customError
    -> ListNonempty ( String, Widget widgetModel msg2 value customError )
    -> Model
    -> value
selectedValue variantSelectWidget variantWidgets model =
    let
        selectedVariantName =
            value variantSelectWidget model

        selectedWidget =
            variantWidgets
                |> List.Nonempty.filter (\( name, _ ) -> name == selectedVariantName)
                |> List.head
                |> withDefault (List.Nonempty.head variantWidgets)
                |> Tuple.second
    in
    read selectedVariantName model
        |> D.decodeValue selectedWidget.decoderModel
        |> Result.map selectedWidget.value
        |> Result.withDefault (selectedWidget.value selectedWidget.init)


view :
    Widget String msg String customError
    -> List ( String, Widget widgetModel msg2 value customError )
    -> DomId
    -> Model
    -> List (Html Msg)
view variantSelectWidget variantWidgets domId model =
    let
        selectedVariantName =
            value variantSelectWidget model

        variantSelectorHtml =
            selectedVariantName
                |> variantSelectWidget.view (subId domId selectorFieldId SingleValue)
                |> List.map (Html.map (\msg -> ForVariantSelect <| variantSelectWidget.encodeMsg msg))

        variantView : ( String, Widget widgetModel msg2 value customError ) -> List (Html Msg)
        variantView ( variantName, variantW ) =
            read variantName model
                |> D.decodeValue variantW.decoderModel
                |> Result.map
                    (\variantModel ->
                        variantW.view (domId ++ variantName) variantModel
                            |> List.map (\html -> Html.map (\m -> ForVariant variantName <| variantW.encodeMsg m) html)
                    )
                |> Result.withDefault
                    [ text "Could not decode variant" ]

        variantsHtml =
            variantWidgets
                |> List.filter (\( name, _ ) -> name == selectedVariantName)
                |> List.map variantView
                |> List.concat
    in
    variantSelectorHtml ++ variantsHtml
