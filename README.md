# Composable Content

Composable content is a react-based tool to visual build up content as JSON as a replacement for a traditional WYSIWYG editor.

The idea is to take re-usable components and let the author drag and drop those components, reorder and edit as they need. 

Composable content was originally developed for [Koi](https://github.com/katalyst/koi) but has since been split out in to a standalone react component.

Bare with us this component still needs plenty of documentation and testing.

## Usage

First add the npm package:

```
yarn add react-composable-content
```

Then consume the component in your project:

```js
import Composable from 'react-composable-content';

render(){
  return(
    <Composable
      config={config}
      allComposableTypes={allComposableTypes}
      formFieldName="content"
    />
  )
}
```
