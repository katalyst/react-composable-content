# 1.0.2

Dependancy changes

* Removed jQuery dependancy
* Removed Ornament dependancy
* Added parameterize as a dependancy

Configuration changes

* Renamed `component.name` to `component.label` and `component.slug` to `component.name` to be more consistent with field configuration
* Renamed `allComposableTypes` prop to `components`
* Removed need for `config` prop to include all component templating, instead we can get that from the `components` prop

This makes config more like this:

```js
config={{
  main: ["text"]
}}
components={[
  name: "text",
  label: "Text",
  fields: [{
    name: "text_field",
    label: "Text",
    type: "text",
  }]
]}
```

# 1.0.1

* Moved to React Context API
* Better support for custom validations
* Better support for custom field types
* Removed "ornament" from jQuery custom event names
* Renamed the `attr` prop to `formFieldName`

# 1.0.0

Initial release