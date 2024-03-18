module WebColor exposing (..)

import Json.Decode as D exposing (Decoder)
import Json.Encode as E exposing (Value)


type WebColor
    = Aliceblue
    | Antiquewhite
    | Aqua
    | Aquamarine
    | Azure
    | Beige
    | Bisque
    | Black
    | Blanchedalmond
    | Blue
    | Blueviolet
    | Brown
    | Burlywood
    | Cadetblue
    | Chartreuse
    | Chocolate
    | Coral
    | Cornflowerblue
    | Cornsilk
    | Crimson
    | Cyan
    | Darkblue
    | Darkcyan
    | Darkgoldenrod
    | Darkgray
    | Darkgreen
    | Darkgrey
    | Darkkhaki
    | Darkmagenta
    | Darkolivegreen
    | Darkorange
    | Darkorchid
    | Darkred
    | Darksalmon
    | Darkseagreen
    | Darkslateblue
    | Darkslategray
    | Darkslategrey
    | Darkturquoise
    | Darkviolet
    | Deeppink
    | Deepskyblue
    | Dimgray
    | Dimgrey
    | Dodgerblue
    | Firebrick
    | Floralwhite
    | Forestgreen
    | Fuchsia
    | Gainsboro
    | Ghostwhite
    | Gold
    | Goldenrod
    | Gray
    | Green
    | Greenyellow
    | Grey
    | Honeydew
    | Hotpink
    | Indianred
    | Indigo
    | Ivory
    | Khaki
    | Lavender
    | Lavenderblush
    | Lawngreen
    | Lemonchiffon
    | Lightblue
    | Lightcoral
    | Lightcyan
    | Lightgoldenrodyellow
    | Lightgray
    | Lightgreen
    | Lightgrey
    | Lightpink
    | Lightsalmon
    | Lightseagreen
    | Lightskyblue
    | Lightslategray
    | Lightslategrey
    | Lightsteelblue
    | Lightyellow
    | Lime
    | Limegreen
    | Linen
    | Magenta
    | Maroon
    | Mediumaquamarine
    | Mediumblue
    | Mediumorchid
    | Mediumpurple
    | Mediumseagreen
    | Mediumslateblue
    | Mediumspringgreen
    | Mediumturquoise
    | Mediumvioletred
    | Midnightblue
    | Mintcream
    | Mistyrose
    | Moccasin
    | Navajowhite
    | Navy
    | Oldlace
    | Olive
    | Olivedrab
    | Orange
    | Orangered
    | Orchid
    | Palegoldenrod
    | Palegreen
    | Paleturquoise
    | Palevioletred
    | Papayawhip
    | Peachpuff
    | Peru
    | Pink
    | Plum
    | Powderblue
    | Purple
    | Rebeccapurple
    | Red
    | Rosybrown
    | Royalblue
    | Saddlebrown
    | Salmon
    | Sandybrown
    | Seagreen
    | Seashell
    | Sienna
    | Silver
    | Skyblue
    | Slateblue
    | Slategray
    | Slategrey
    | Snow
    | Springgreen
    | Steelblue
    | Tan
    | Teal
    | Thistle
    | Tomato
    | Transparent
    | Turquoise
    | Violet
    | Wheat
    | White
    | Whitesmoke
    | Yellow
    | Yellowgreen


all : List WebColor
all =
    [ Aliceblue
    , Antiquewhite
    , Aqua
    , Aquamarine
    , Azure
    , Beige
    , Bisque
    , Black
    , Blanchedalmond
    , Blue
    , Blueviolet
    , Brown
    , Burlywood
    , Cadetblue
    , Chartreuse
    , Chocolate
    , Coral
    , Cornflowerblue
    , Cornsilk
    , Crimson
    , Cyan
    , Darkblue
    , Darkcyan
    , Darkgoldenrod
    , Darkgray
    , Darkgreen
    , Darkgrey
    , Darkkhaki
    , Darkmagenta
    , Darkolivegreen
    , Darkorange
    , Darkorchid
    , Darkred
    , Darksalmon
    , Darkseagreen
    , Darkslateblue
    , Darkslategray
    , Darkslategrey
    , Darkturquoise
    , Darkviolet
    , Deeppink
    , Deepskyblue
    , Dimgray
    , Dimgrey
    , Dodgerblue
    , Firebrick
    , Floralwhite
    , Forestgreen
    , Fuchsia
    , Gainsboro
    , Ghostwhite
    , Gold
    , Goldenrod
    , Gray
    , Green
    , Greenyellow
    , Grey
    , Honeydew
    , Hotpink
    , Indianred
    , Indigo
    , Ivory
    , Khaki
    , Lavender
    , Lavenderblush
    , Lawngreen
    , Lemonchiffon
    , Lightblue
    , Lightcoral
    , Lightcyan
    , Lightgoldenrodyellow
    , Lightgray
    , Lightgreen
    , Lightgrey
    , Lightpink
    , Lightsalmon
    , Lightseagreen
    , Lightskyblue
    , Lightslategray
    , Lightslategrey
    , Lightsteelblue
    , Lightyellow
    , Lime
    , Limegreen
    , Linen
    , Magenta
    , Maroon
    , Mediumaquamarine
    , Mediumblue
    , Mediumorchid
    , Mediumpurple
    , Mediumseagreen
    , Mediumslateblue
    , Mediumspringgreen
    , Mediumturquoise
    , Mediumvioletred
    , Midnightblue
    , Mintcream
    , Mistyrose
    , Moccasin
    , Navajowhite
    , Navy
    , Oldlace
    , Olive
    , Olivedrab
    , Orange
    , Orangered
    , Orchid
    , Palegoldenrod
    , Palegreen
    , Paleturquoise
    , Palevioletred
    , Papayawhip
    , Peachpuff
    , Peru
    , Pink
    , Plum
    , Powderblue
    , Purple
    , Rebeccapurple
    , Red
    , Rosybrown
    , Royalblue
    , Saddlebrown
    , Salmon
    , Sandybrown
    , Seagreen
    , Seashell
    , Sienna
    , Silver
    , Skyblue
    , Slateblue
    , Slategray
    , Slategrey
    , Snow
    , Springgreen
    , Steelblue
    , Tan
    , Teal
    , Thistle
    , Tomato
    , Transparent
    , Turquoise
    , Violet
    , Wheat
    , White
    , Whitesmoke
    , Yellow
    , Yellowgreen
    ]


fromString : String -> Maybe WebColor
fromString s =
    case s of
        "Aliceblue" ->
            Just Aliceblue

        "Antiquewhite" ->
            Just Antiquewhite

        "Aqua" ->
            Just Aqua

        "Aquamarine" ->
            Just Aquamarine

        "Azure" ->
            Just Azure

        "Beige" ->
            Just Beige

        "Bisque" ->
            Just Bisque

        "Black" ->
            Just Black

        "Blanchedalmond" ->
            Just Blanchedalmond

        "Blue" ->
            Just Blue

        "Blueviolet" ->
            Just Blueviolet

        "Brown" ->
            Just Brown

        "Burlywood" ->
            Just Burlywood

        "Cadetblue" ->
            Just Cadetblue

        "Chartreuse" ->
            Just Chartreuse

        "Chocolate" ->
            Just Chocolate

        "Coral" ->
            Just Coral

        "Cornflowerblue" ->
            Just Cornflowerblue

        "Cornsilk" ->
            Just Cornsilk

        "Crimson" ->
            Just Crimson

        "Cyan" ->
            Just Cyan

        "Darkblue" ->
            Just Darkblue

        "Darkcyan" ->
            Just Darkcyan

        "Darkgoldenrod" ->
            Just Darkgoldenrod

        "Darkgray" ->
            Just Darkgray

        "Darkgreen" ->
            Just Darkgreen

        "Darkgrey" ->
            Just Darkgrey

        "Darkkhaki" ->
            Just Darkkhaki

        "Darkmagenta" ->
            Just Darkmagenta

        "Darkolivegreen" ->
            Just Darkolivegreen

        "Darkorange" ->
            Just Darkorange

        "Darkorchid" ->
            Just Darkorchid

        "Darkred" ->
            Just Darkred

        "Darksalmon" ->
            Just Darksalmon

        "Darkseagreen" ->
            Just Darkseagreen

        "Darkslateblue" ->
            Just Darkslateblue

        "Darkslategray" ->
            Just Darkslategray

        "Darkslategrey" ->
            Just Darkslategrey

        "Darkturquoise" ->
            Just Darkturquoise

        "Darkviolet" ->
            Just Darkviolet

        "Deeppink" ->
            Just Deeppink

        "Deepskyblue" ->
            Just Deepskyblue

        "Dimgray" ->
            Just Dimgray

        "Dimgrey" ->
            Just Dimgrey

        "Dodgerblue" ->
            Just Dodgerblue

        "Firebrick" ->
            Just Firebrick

        "Floralwhite" ->
            Just Floralwhite

        "Forestgreen" ->
            Just Forestgreen

        "Fuchsia" ->
            Just Fuchsia

        "Gainsboro" ->
            Just Gainsboro

        "Ghostwhite" ->
            Just Ghostwhite

        "Gold" ->
            Just Gold

        "Goldenrod" ->
            Just Goldenrod

        "Gray" ->
            Just Gray

        "Green" ->
            Just Green

        "Greenyellow" ->
            Just Greenyellow

        "Grey" ->
            Just Grey

        "Honeydew" ->
            Just Honeydew

        "Hotpink" ->
            Just Hotpink

        "Indianred" ->
            Just Indianred

        "Indigo" ->
            Just Indigo

        "Ivory" ->
            Just Ivory

        "Khaki" ->
            Just Khaki

        "Lavender" ->
            Just Lavender

        "Lavenderblush" ->
            Just Lavenderblush

        "Lawngreen" ->
            Just Lawngreen

        "Lemonchiffon" ->
            Just Lemonchiffon

        "Lightblue" ->
            Just Lightblue

        "Lightcoral" ->
            Just Lightcoral

        "Lightcyan" ->
            Just Lightcyan

        "Lightgoldenrodyellow" ->
            Just Lightgoldenrodyellow

        "Lightgray" ->
            Just Lightgray

        "Lightgreen" ->
            Just Lightgreen

        "Lightgrey" ->
            Just Lightgrey

        "Lightpink" ->
            Just Lightpink

        "Lightsalmon" ->
            Just Lightsalmon

        "Lightseagreen" ->
            Just Lightseagreen

        "Lightskyblue" ->
            Just Lightskyblue

        "Lightslategray" ->
            Just Lightslategray

        "Lightslategrey" ->
            Just Lightslategrey

        "Lightsteelblue" ->
            Just Lightsteelblue

        "Lightyellow" ->
            Just Lightyellow

        "Lime" ->
            Just Lime

        "Limegreen" ->
            Just Limegreen

        "Linen" ->
            Just Linen

        "Magenta" ->
            Just Magenta

        "Maroon" ->
            Just Maroon

        "Mediumaquamarine" ->
            Just Mediumaquamarine

        "Mediumblue" ->
            Just Mediumblue

        "Mediumorchid" ->
            Just Mediumorchid

        "Mediumpurple" ->
            Just Mediumpurple

        "Mediumseagreen" ->
            Just Mediumseagreen

        "Mediumslateblue" ->
            Just Mediumslateblue

        "Mediumspringgreen" ->
            Just Mediumspringgreen

        "Mediumturquoise" ->
            Just Mediumturquoise

        "Mediumvioletred" ->
            Just Mediumvioletred

        "Midnightblue" ->
            Just Midnightblue

        "Mintcream" ->
            Just Mintcream

        "Mistyrose" ->
            Just Mistyrose

        "Moccasin" ->
            Just Moccasin

        "Navajowhite" ->
            Just Navajowhite

        "Navy" ->
            Just Navy

        "Oldlace" ->
            Just Oldlace

        "Olive" ->
            Just Olive

        "Olivedrab" ->
            Just Olivedrab

        "Orange" ->
            Just Orange

        "Orangered" ->
            Just Orangered

        "Orchid" ->
            Just Orchid

        "Palegoldenrod" ->
            Just Palegoldenrod

        "Palegreen" ->
            Just Palegreen

        "Paleturquoise" ->
            Just Paleturquoise

        "Palevioletred" ->
            Just Palevioletred

        "Papayawhip" ->
            Just Papayawhip

        "Peachpuff" ->
            Just Peachpuff

        "Peru" ->
            Just Peru

        "Pink" ->
            Just Pink

        "Plum" ->
            Just Plum

        "Powderblue" ->
            Just Powderblue

        "Purple" ->
            Just Purple

        "Rebeccapurple" ->
            Just Rebeccapurple

        "Red" ->
            Just Red

        "Rosybrown" ->
            Just Rosybrown

        "Royalblue" ->
            Just Royalblue

        "Saddlebrown" ->
            Just Saddlebrown

        "Salmon" ->
            Just Salmon

        "Sandybrown" ->
            Just Sandybrown

        "Seagreen" ->
            Just Seagreen

        "Seashell" ->
            Just Seashell

        "Sienna" ->
            Just Sienna

        "Silver" ->
            Just Silver

        "Skyblue" ->
            Just Skyblue

        "Slateblue" ->
            Just Slateblue

        "Slategray" ->
            Just Slategray

        "Slategrey" ->
            Just Slategrey

        "Snow" ->
            Just Snow

        "Springgreen" ->
            Just Springgreen

        "Steelblue" ->
            Just Steelblue

        "Tan" ->
            Just Tan

        "Teal" ->
            Just Teal

        "Thistle" ->
            Just Thistle

        "Tomato" ->
            Just Tomato

        "Transparent" ->
            Just Transparent

        "Turquoise" ->
            Just Turquoise

        "Violet" ->
            Just Violet

        "Wheat" ->
            Just Wheat

        "White" ->
            Just White

        "Whitesmoke" ->
            Just Whitesmoke

        "Yellow" ->
            Just Yellow

        "Yellowgreen" ->
            Just Yellowgreen

        _ ->
            Nothing


asStr : WebColor -> String
asStr c =
    case c of
        Aliceblue ->
            "Aliceblue"

        Antiquewhite ->
            "Antiquewhite"

        Aqua ->
            "Aqua"

        Aquamarine ->
            "Aquamarine"

        Azure ->
            "Azure"

        Beige ->
            "Beige"

        Bisque ->
            "Bisque"

        Black ->
            "Black"

        Blanchedalmond ->
            "Blanchedalmond"

        Blue ->
            "Blue"

        Blueviolet ->
            "Blueviolet"

        Brown ->
            "Brown"

        Burlywood ->
            "Burlywood"

        Cadetblue ->
            "Cadetblue"

        Chartreuse ->
            "Chartreuse"

        Chocolate ->
            "Chocolate"

        Coral ->
            "Coral"

        Cornflowerblue ->
            "Cornflowerblue"

        Cornsilk ->
            "Cornsilk"

        Crimson ->
            "Crimson"

        Cyan ->
            "Cyan"

        Darkblue ->
            "Darkblue"

        Darkcyan ->
            "Darkcyan"

        Darkgoldenrod ->
            "Darkgoldenrod"

        Darkgray ->
            "Darkgray"

        Darkgreen ->
            "Darkgreen"

        Darkgrey ->
            "Darkgrey"

        Darkkhaki ->
            "Darkkhaki"

        Darkmagenta ->
            "Darkmagenta"

        Darkolivegreen ->
            "Darkolivegreen"

        Darkorange ->
            "Darkorange"

        Darkorchid ->
            "Darkorchid"

        Darkred ->
            "Darkred"

        Darksalmon ->
            "Darksalmon"

        Darkseagreen ->
            "Darkseagreen"

        Darkslateblue ->
            "Darkslateblue"

        Darkslategray ->
            "Darkslategray"

        Darkslategrey ->
            "Darkslategrey"

        Darkturquoise ->
            "Darkturquoise"

        Darkviolet ->
            "Darkviolet"

        Deeppink ->
            "Deeppink"

        Deepskyblue ->
            "Deepskyblue"

        Dimgray ->
            "Dimgray"

        Dimgrey ->
            "Dimgrey"

        Dodgerblue ->
            "Dodgerblue"

        Firebrick ->
            "Firebrick"

        Floralwhite ->
            "Floralwhite"

        Forestgreen ->
            "Forestgreen"

        Fuchsia ->
            "Fuchsia"

        Gainsboro ->
            "Gainsboro"

        Ghostwhite ->
            "Ghostwhite"

        Gold ->
            "Gold"

        Goldenrod ->
            "Goldenrod"

        Gray ->
            "Gray"

        Green ->
            "Green"

        Greenyellow ->
            "Greenyellow"

        Grey ->
            "Grey"

        Honeydew ->
            "Honeydew"

        Hotpink ->
            "Hotpink"

        Indianred ->
            "Indianred"

        Indigo ->
            "Indigo"

        Ivory ->
            "Ivory"

        Khaki ->
            "Khaki"

        Lavender ->
            "Lavender"

        Lavenderblush ->
            "Lavenderblush"

        Lawngreen ->
            "Lawngreen"

        Lemonchiffon ->
            "Lemonchiffon"

        Lightblue ->
            "Lightblue"

        Lightcoral ->
            "Lightcoral"

        Lightcyan ->
            "Lightcyan"

        Lightgoldenrodyellow ->
            "Lightgoldenrodyellow"

        Lightgray ->
            "Lightgray"

        Lightgreen ->
            "Lightgreen"

        Lightgrey ->
            "Lightgrey"

        Lightpink ->
            "Lightpink"

        Lightsalmon ->
            "Lightsalmon"

        Lightseagreen ->
            "Lightseagreen"

        Lightskyblue ->
            "Lightskyblue"

        Lightslategray ->
            "Lightslategray"

        Lightslategrey ->
            "Lightslategrey"

        Lightsteelblue ->
            "Lightsteelblue"

        Lightyellow ->
            "Lightyellow"

        Lime ->
            "Lime"

        Limegreen ->
            "Limegreen"

        Linen ->
            "Linen"

        Magenta ->
            "Magenta"

        Maroon ->
            "Maroon"

        Mediumaquamarine ->
            "Mediumaquamarine"

        Mediumblue ->
            "Mediumblue"

        Mediumorchid ->
            "Mediumorchid"

        Mediumpurple ->
            "Mediumpurple"

        Mediumseagreen ->
            "Mediumseagreen"

        Mediumslateblue ->
            "Mediumslateblue"

        Mediumspringgreen ->
            "Mediumspringgreen"

        Mediumturquoise ->
            "Mediumturquoise"

        Mediumvioletred ->
            "Mediumvioletred"

        Midnightblue ->
            "Midnightblue"

        Mintcream ->
            "Mintcream"

        Mistyrose ->
            "Mistyrose"

        Moccasin ->
            "Moccasin"

        Navajowhite ->
            "Navajowhite"

        Navy ->
            "Navy"

        Oldlace ->
            "Oldlace"

        Olive ->
            "Olive"

        Olivedrab ->
            "Olivedrab"

        Orange ->
            "Orange"

        Orangered ->
            "Orangered"

        Orchid ->
            "Orchid"

        Palegoldenrod ->
            "Palegoldenrod"

        Palegreen ->
            "Palegreen"

        Paleturquoise ->
            "Paleturquoise"

        Palevioletred ->
            "Palevioletred"

        Papayawhip ->
            "Papayawhip"

        Peachpuff ->
            "Peachpuff"

        Peru ->
            "Peru"

        Pink ->
            "Pink"

        Plum ->
            "Plum"

        Powderblue ->
            "Powderblue"

        Purple ->
            "Purple"

        Rebeccapurple ->
            "Rebeccapurple"

        Red ->
            "Red"

        Rosybrown ->
            "Rosybrown"

        Royalblue ->
            "Royalblue"

        Saddlebrown ->
            "Saddlebrown"

        Salmon ->
            "Salmon"

        Sandybrown ->
            "Sandybrown"

        Seagreen ->
            "Seagreen"

        Seashell ->
            "Seashell"

        Sienna ->
            "Sienna"

        Silver ->
            "Silver"

        Skyblue ->
            "Skyblue"

        Slateblue ->
            "Slateblue"

        Slategray ->
            "Slategray"

        Slategrey ->
            "Slategrey"

        Snow ->
            "Snow"

        Springgreen ->
            "Springgreen"

        Steelblue ->
            "Steelblue"

        Tan ->
            "Tan"

        Teal ->
            "Teal"

        Thistle ->
            "Thistle"

        Tomato ->
            "Tomato"

        Transparent ->
            "Transparent"

        Turquoise ->
            "Turquoise"

        Violet ->
            "Violet"

        Wheat ->
            "Wheat"

        White ->
            "White"

        Whitesmoke ->
            "Whitesmoke"

        Yellow ->
            "Yellow"

        Yellowgreen ->
            "Yellowgreen"


encodeColor : WebColor -> Value
encodeColor color =
    E.string (asStr color)


decoderColor : Decoder WebColor
decoderColor =
    D.string
        |> D.andThen
            (\s ->
                fromString s
                    |> Maybe.map D.succeed
                    |> Maybe.withDefault
                        (D.fail "unknown color")
            )
