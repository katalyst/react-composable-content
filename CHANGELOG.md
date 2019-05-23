# 1.0.6

Additions:

* Added `ignoreDraftValidations` prop to ignore validations for draft components.

# 1.0.5

Additions:

* Added stories for validations
* Added `onMount` callback

Fixes:

* Fixed component add callback and renamed it to `onComponentAdd` to be consistent with other callbacks
* Fixed the `anyValues` validation
* Removed some unnecessary koi debug code

# 1.0.4

Additions:

* Added storybook, run with `yarn storybook`
* `config` prop is now optional, if no config is present the composition will allow all components in the `components` prop and create a single group named `main`
* Draft mode is now opt-in with `draftMode: true`
* Added translation options via the `lang` prop
* Added a `sectionifier` helper for JSON data that requires being formatted in to sections
* Component `message` can now be HTML
* Conditional fields with the `condition` prop for fields
* Styling enhancements

Fixes:

* Fixed issues with radio/checkbox collections

# 1.0.3

Removals:

* `RichText`, `Asset`, `Date` and `Colour` field types have been removed as they were Koi-specific fields, some of these could be looked at as new builtins later on

Additions: 

* Icons are now an optional bundle - see below for more information
* Basic stylesheet is an optional CSS bundle - ideally moving toward a better system, eg. css-in-js later on, but for now this is a quick win and helps move towards building a demo
* Nicer warning when you have a config using an undefined component
* Added `onCompositionChange` prop to do something with the JSON data whenever the composition changes, eg. send data via ajax or re-render something

SVG Icons have been bundled as an optional inclusion:

```js
import ComposableContent from 'react-composable-content';
import icons from 'react-composable-content/icons';

<ComposableContent
  icons={icons}
/>
```

Or if you prefer to specify which icons you want to include, or if you want to mix-and-match the builtin icons with your own, you can import specific icons:

```js
import ComposableContent from 'react-composable-content';
import visible from 'react-composable-content/icons/visible.svg';
import myOtherIcon from './assets/my-other-icon.svg';

<ComposableContent
  icons={{
    visible,
    myOtherIcon,
  }}
/>
```

All icons should be inline SVG code.

# 1.0.2

Dependency changes

* Removed jQuery dependency
* Removed Ornament dependency
* Added parameterize as a dependency

Fixes

* Fixed close advanced settings button not working
* Fixed collapse all / reveal all

Breaking Configuration changes

* Renamed `component.name` to `component.label` and `component.slug` to `component.name` to be more consistent with field configuration
* Renamed `allComposableTypes` prop to `components`
* Removed need for `config` prop to include all component templating, instead we can get that from the `components` prop
* Advanced settings are now configurable as `advancedSettings`

This makes config more like this:

```js
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
advancedSettings={[
  {
    name: "class",
    label: "Class",
  },{
    name: "id",
    label: "Id",
    hint: "This can be used for anchoring purposes",
  }
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