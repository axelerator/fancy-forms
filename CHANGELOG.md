# Changelog

## [7.0.0] - 2024-08-02

- Swap NonEmptyList implementation to resolve [problem with deps](https://github.com/axelerator/fancy-forms/issues/2)
- Add "custom events" to send Msg from inside forms to 
> One thing we can't easily do is to send Msg from the outside app from inside the form.
> The way the form widgets can be arbitrarily nested is thal all its messages get serialized to JSON and back.
> 
> We can't infer how to do that for message from the outside. Instead of adding another type parameter and functions for serializing to the form functions we offer a workaround: You can emit a "custom event" with arbitrary JSON data from within the form.

## [6.0.0] - 2024-04-27

Variant widgets can now have their own, arbitrary `Model` type (and not just a `String`).

## [5.0.0] - 2024-04-22

`fieldWithVariants` breaks down one into two parameters: 
 - one to extract the field value from the forms value 
 - one to decide based on it which widget variant to show
