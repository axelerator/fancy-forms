# FancyForms

[_FancyForms_](https://blog.axelerator.de/fancy-forms/) is a library for building forms in Elm.
It is designed with the following goals in mind:

1. **Type safety**: Data collected in the forms will be returned directly into a user provided type.
1. **Ease of use**: No matter how complex the form is, it will only need **one** `Msg` and **one** field on the model.
1. **Customization**: Users can provide their own widgets and custom validations.
1. **CSS Agnostic**: Adapts to any CSS framework.
1. **Composable**: Smaller forms can be combined into larger forms.
1. **I18n**: Internationalization is supported by avoiding hard coded strings.

## Documentation

https://blog.axelerator.de/fancy-forms/

I have not invested heavily into the [Package Docs](https://package.elm-lang.org/packages/axelerator/fancy-forms) yet.
But there are some detailed examples with explanations in the dedicated docs


## 🚧 Work in progress 🚧

The library is still under active development and is still missing some features to be production ready.

Checklist:

 - [x] Type safety
 - [x] Custom widget support
 - [ ] Form can be initialized with custom values
 - [ ] Validation errors aggregate to the top
 - Lists fields:
    - [x] Any widget can be used as list item
    - [x] User can add and remove list items
    - [ ] User can reorder list items
    - [ ] User can add list item **at specified index**
 - Variant fields:
    - [x] Widget to select variant can be specified
    - [x] Any widget can be used as variant input


## Decisions

### Focus on extendability

The API is heavily inspired by [dillonkearns/elm-form](https://package.elm-lang.org/packages/dillonkearns/elm-form/3.0.0/) 🙏
But contrary to `elm-form` I did not aim for compatibilty with [elm-pages](https://elm-pages.com) and [lamdera](https://lamdera.com).
So I do blatanlty store functions in the `Model` for example.


### `List (Html msg)` over `Html msg` as return type

Functions that return `List (Html msg)` are more composable. Specifically when nesting
the "wrapping" component can decide whether to concatenate the list or not.

This allows for more flexibility in the markup to for example account for markup required
by certain CSS frameworks like Bootstrap.

Instead of having labels and errors in different containers they can all live next to each
other.

### Custom error type

Having to proivde a custom error type might seem like it adds unnecessary complexity.
The primary motivation is to allow to keep error messages translatable without having to
draw the translation logic into the form library (or the form logic in the application).

