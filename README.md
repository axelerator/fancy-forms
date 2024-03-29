# FancyForms

_FancyForms_ is a library for building forms in Elm.
It is designed with the following goals in mind:

1. **Type saftey**: Data collected in the forms will be returned directly into a user provided type.
1. **Ease of use**: No matter how complex the form is, it will only need **one** `Msg` and **one** field on the model.
1. **Customization**: Users can provide their own widgets and custom validations.
1. **CSS Agnostic**: Adapts to any CSS framework.
1. **Composable**: Smaller forms can be combined into larger forms.
1. **I18n**: Internationalization is supported by avoiding hard coded strings.

# Decisions


## `List (Html msg)` over `Html msg` as return type

Functions that return `List (Html msg)` are more composable. Specifically when nesting
the "wrapping" component can decide whether to concatenate the list or not.

This allows for more flexibility in the markup to for example account for markup required
by certain CSS frameworks like Bootstrap.

Instead of having labels and errors in different containers they can all live next to each
other.

## Custom error type

Having to proivde a custom error type might seem like it adds unnecessary complexity.
The primary motivation is to allow to keep error messages translatable without having to
draw the translation logic into the form library (or the form logic in the application).
