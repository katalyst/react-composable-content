# Composable Content

Composable content is a react-based tool to visually build up content as JSON, as a replacement for a traditional WYSIWYG editor.

The idea is to take re-usable components and let the author drag and drop those components, reorder and edit as they need. 

Composable content was originally developed for [Koi](https://github.com/katalyst/koi) but has since been split out in to a standalone react component.

Bare with us this component still needs plenty of documentation and testing.

1. [Usage](#usage)
1. [Props](#props)

## Usage

First add the npm package:

```
yarn add react-composable-content
```

Then consume the component in your project:

```js
import Composable from 'react-composable-content';
import * as icons from 'react-composable-content/icons';
import 'react-composable-content/react-composable-content.css';

render(){
  return(
    <Composable
      config={{
        main: ["text"]
      }}
      components={[
        {
          name: "text",
          label: "Text",
          fields: [{
            name: "text_field",
            label: "Text",
            type: "text",
          }]
        }
      ]}
      icons={icons}
      formFieldName="content"
    />
  )
}
```

## Props

### config

An object containing named groups and an array of component names for those groups:

```js
config={{
  main: ["component1", "component2, component7"],
  sidebar: ["component3", "component15"]
}}
```

This will configure two groups, "main" and "sidebar".  
Main will be allowed to drag in component1, component2 and component7.  
Sidebar will only be allowed to drag in component3 and component15.  

### components

```js
components={[
  {
    name: "my_component",
    label: "This is my custom component",
    icon: "paragraph",
    fields: [{
      name: "first_name",
      label: "First name",
      type: "string",
    },{
      name: "address",
      label: "Address",
      type: "text",
    }]
  }
]}
```

Components can have the following properties:

|prop|optional|description|
|-|-|-|
|name| |An internal slug-like name for the component, used to ID the component in your `config`|
|label| |The user-visible label for the component|
|primary|optional|The primary field used in the preview area of the component|
|message|optional|A message to appear at the top of the component|
|messageType|optional|A class to appear on your message|
|icon|optional|The icon used for your component, will appear in the list of components on the right and in the header of the component|
|fields|optional|An array of fields for this component. If there are no fields defined the user will see "This component doesn't require configuration"|

Fields can have the following properties:

|prop|optional|description|
|-|-|-|
|name| |An internal slug-like name for the field|
|label| |The label of the field as it appears to the user|
|type|optional|The name of the react component to render for the field, eg "string" => "ComposableFieldString", "other_field" => "ComposableFieldOtherfield" etc.|
|hint|optional|A hint message to appear between the label and the field|
|defaultValue|optional|The default value for the input field|
|wrapperClass|optional|Custom class for the element that wraps around the label/hint/field/error etc.|
|className|optional|Custom class for the input field itself|
|data|conditionally|Required for select, checkbox or radios. Can be either an array of values - `[1,2,3]` or an array of objects - `[{ name: "one", value: 1 },{ name: "two", value: 2 }]`
|fieldAttributes|optional|Any custom html attributes you need for the input field, can be used for requiredness|
|fields|conditional|Nested fields, applicable only to the `repeater` field type|

### icons

An array of inline SVG code for icons.  
It's recommended you use the `react-composable-content/icons` import to configure your icons.  

```js
icons={{
  cog, visible, myCustomIcon, myOtherCustomIcon,
}}
```

These icons can be used in your component configuration

### formFieldName

Composable content can be used inside a form element to render a hidden input field to save the JSON result to your database.  
This prop is the `name` attribute of the hidden input field.  

### advancedSettings

A series of form fields to show in the advanced menu of components.  
If this prop is not present the advanced settings menu will be removed altogether.  

```js
advancedSettings={[
  name: "css_class",
  label: "Class (CSS)",
  type: "string",
]}
```

You can have as many advanced fields as you like.

### debug

Set to `true` to show the JSON output under your composable content

## Callback functions / integration options

### onMount

Callback function to run when the component mounts

### onCompositionChange

Callback function to run when the composition is changed

```js
onCompositionChange={(json) => {
  this.updateData(json);
}}
```

### onDragStart

Callback function to run when dragging starts  
This piggybacks off of `react-beautiful-dnd` so the arguments are the same:

```js
onDragStart={(start, provided) => {
  //
}}
```

### onDragEnd

Callback function to run when dragging stops and the composition has been updated  
This piggybacks off of `react-beautiful-dnd` so the arguments are the same:

```js
onDragStart={(result, provided) => {
  //
}}
```

### customValidations

### customFormFieldComponents

### externalSubmission