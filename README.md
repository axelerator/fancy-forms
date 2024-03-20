# Fancy Forms proof of concept

This is a proof of concept for a form builder library that satisfies the following requirements:

- a form can collect data into a proper custom type
- only one msg/model field for the whole form
- custom, reusable "3rd party" input widgets can be created without forking the lib

# Demo

Just clone and open `index.html`

![](./fancy-forms.mov)

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
