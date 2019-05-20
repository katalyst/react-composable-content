import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
// import { Button, Welcome } from '@storybook/react/demo';

// Storybook styles and helpers
import "./index.css";
import { getDemoComponents } from './story-helpers';

// Composable content
import "../src/react-composable-content.css";
import ComposableContent from '../src/index';
import * as icons from '../src/icons';

import IntegrationExample from './react-components/integration';

const Wrapper = props => {

  // Clean up props for user consumption
  let propsCode = { ...props.componentProps };
  if(propsCode.icons) {
    propsCode.icons = "%%ICONS%%";
  }
  propsCode = JSON.stringify(propsCode, null, 2);
  propsCode = propsCode.replace("\"%%ICONS%%\"", "icons");

  return(
    <div style={{ padding: "20px 40px" }}>
      {props.title &&
        <h1 className="heading-one">{props.title}</h1>
      }
      {props.intro &&
        <div className="intro" dangerouslySetInnerHTML={{__html: props.intro}}></div>
      }
      {props.componentProps &&
        <details>
          <summary>
            <h2 style={{ display: "inline" }}>Props</h2>
          </summary>
          <pre className="code-pre">
            {propsCode}
          </pre>
        </details>
      }
      <hr style={{ height: "1px", border: "0", background: "#ccc", margin: "1rem 0" }} />
      <div style={{ marginTop: "1rem" }}>
        {React.Children.map(props.children, child => React.cloneElement(child, props.componentProps))}
      </div>
    </div>
  )
}

storiesOf('Composition settings', module)
  .add('Basic', () => 
    <Wrapper
      title="Basic"
      intro="<p>A really basic implementation with no config, just an array of components</p>"
      componentProps={{
        components: getDemoComponents(["component1"]),
        debug: true,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Existing data', () =>
    <Wrapper
      title="Existing data"
      intro="<p>You can provide a <code>composition</code> prop with the JSON data to show existing data:</p>"
      componentProps={{
        composition: {
          "main": [
            {
              "id": 1558273755811,
              "component_type": "component1",
              "component_collapsed": false,
              "component_draft": false,
              "advanced": {},
              "data": {
                "first_name": "Test",
                "last_name": "Name"
              }
            }
          ]
        },
        components: getDemoComponents(["component1"]),
        debug: true,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('White-listing components', () =>
    <Wrapper
      title="White-listing components"
      intro="<p>You can use the <code>config</code> prop to white-list which components the user is allowed to use. Here we are passing in three components but only white-listing one. This will become relevant if you start using groups.</p>"
      componentProps={{
        config: { main: ["component2"] },
        components: getDemoComponents(["component1", "component2", "component3"]),
        debug: true,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Icons', () => 
    <Wrapper
      title="Icons"
      intro={`
        <p>By adding icons you can now assign icons to each component and various UI buttons will show their icons now too.</p>
        <p>Import the icons in to your application:</p>
        <pre>import * as icons from 'react-composable-content/icons'</pre>
      `}
      componentProps={{
        config: { main: ["component1", "component2", "component3"] },
        components: getDemoComponents(["component1", "component2", "component3"]),
        debug: true,
        icons: icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Groups', () => 
    <Wrapper
      title="Groups"
      intro="<p>You can create as many groups as you like to manage composable content for various sections of your page. You can white-list components to only certain groups.</p>"
      componentProps={{
        config: {
          main: ["component1", "component2", "component3"],
          sidebar: ["component2"],
        },
        components: getDemoComponents(["component1", "component2", "component3"]),
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Advanced settings', () => 
    <Wrapper
      title="Advanced Settings"
      intro="<p>Advanced settings are extra fields that appear on each component, accessible under the new advanced settings cog.</p>"
      componentProps={{
        advancedSettings: [{
          name: "css_class",
          label: "Class (CSS)",
        },{
          name: "visible",
          label: "Visible to public",
          type: "boolean",
        }],
        components: getDemoComponents(["component1", "component2", "component3"]),
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Draft mode', () => 
    <Wrapper
      title="Draft mode"
      intro={`
        <p>Draft mode will let the user mark components in their composition as draft. This will add a <code>component_draft</code> flag in the JSON data.</p>
        <p>Developers can use this flag to only conditionally or optionally render those components on their page.</p>
      `}
      componentProps={{
        draftMode: true,
        components: getDemoComponents(["component1", "component2", "component3"]),
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Missing component template', () => 
    <Wrapper
      title="Missing component template"
      intro="<p>Whenever your config uses an undefined component type, the UI will show that it's missing in the component picker and when you place it in to your composition there will be a friendly error message.</p>"
      componentProps={{
        config: {
          main: ["component1", "broken"]
        },
        components: getDemoComponents(["component1"]),
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Translations', () => 
    <Wrapper
      title="Translations"
      intro={`
        <p>The <code>lang</code> prop can be used to override certain labels and messaging.</p>
        <p>Current options:</p>
        <table class='table'>
          <thead>
            <tr>
              <th>Key</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>emptyComposition</td>
              <td>The message that appears in the composition area when there are no components</td>
            </tr>
            <tr>
              <td>collapseAll</td>
              <td>Label for the collapse all button</td>
            </tr>
            <tr>
              <td>revealAll</td>
              <td>Label for the reveal all button</td>
            </tr>
            <tr>
              <td>remove</td>
              <td>Label for the remove button in the component header</td>
            </tr>
            <tr>
              <td>draftModeBanner</td>
              <td>The message that appears when a component is in draft mode</td>
            </tr>
          </tbody>
        </table>
      `}
      componentProps={{
        components: getDemoComponents(["component1"]),
        lang: {
          emptyComposition: "Your composition is empty, drag a component here to start editing!",
          collapseAll: "Collapse all those components",
          revealAll: "Or not, whatever",
          remove: "Get rid of this component",
          draftModeBanner: "This component is in draft mode",
        },
        draftMode: true,
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Sections', () => 
    <Wrapper
      title="Sections"
      intro={`
        <p>Composable content doesn't have any concept of nesting components but it can be enhanced with a "section" component that can be used to group things together when rendering.</p>
      `}
      componentProps={{
        components:[{
          name: "section",
          label: "Section",
          icon: "section",
          fields: [{
            name: "section_type",
            type: "select",
            data: ["full-width", "container", "callout"],
          }]
        },{
          name: "text",
          label: "Text",
          icon: "paragraph",
          fields: [{
            name: "text",
            type: "textarea",
          }]
        }],
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )

storiesOf('Component settings', module)
  .add('Messages', () => 
    <Wrapper
      title="Messages"
      intro="<p>Messages appear at the top of components, they do not get saved in the JSON as they are UI only</p>"
      componentProps={{
        components: [{
          name: "example",
          label: "Example with message",
          message: "This is some user-facing information about this component to help them understand the purpose of it.",
          fields: [{
            name: "boolean",
            type: "boolean",
            label: "Yes?",
          }]
        }],
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('No fields', () => 
    <Wrapper
      title="No fields"
      intro={`
        <p>When a component is configured with no fields, the user will see a message saying that the component doesn't require any configuration. This is perfectly fine and has been a valid use-case for things that need to appear in the content but is either hardcoded or represents something that isn't editable eg. Adwords banner</p>
        <p>By adding the <code>message</code> prop as well, you can override the default message.</p>
      `}
      componentProps={{
        components:[{
          name: "no_config",
          label: "No configuration",
        },{
          name: "no_config_with_message",
          label: "Custom message",
          message: "This component really doesn't need any configuration at all"
        }],
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )


storiesOf('Composable fields', module)
  .add('Field options', () => 
    <Wrapper
      title="Field options"
      intro="<p>A demo of various options you can pass to fields.</p>"
      componentProps={{
        components: [{
          name: "example",
          label: "Example",
          fields: [{
            name: "hint",
            label: "This field has a hint",
            hint: "This is a hint message",
          },{
            name: "default_value",
            label: "This field has a default value of 5",
            defaultValue: "5",
          },{
            name: "placeholder",
            label: "This field has a placeholder",
            placeholder: "This is a placeholder",
          },{
            name: "number",
            label: "This is a number field with a min of 1 and max of 20",
            fieldAttributes: {
              type: "number",
              min: 1,
              max: 20,
            },
          },{
            name: "custom_styles",
            label: "This field has a custom style attribute",
            fieldAttributes: {
              style: {
                border: "10px solid blue",
                padding: "1rem",
              }
            },
          }]
        }],
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Collections', () => {
      const objectDemo = [{ label: "one", value: 1 },{ label: "two", value: 2 },{ label: "three", value: 3 }];
      const arrayDemo = ["one", "two", "three"];
      return(
        <Wrapper
          title="Collections"
          intro="<p>A demo of a component that has a series of checkboxes, radio buttons and a select menu</p>"
          componentProps={{
            components: [{
              name: "array",
              label: "Array collections",
              icon: "stack",
              message: "These are collections whose data is just a flat array, the value and user-facing label is the same.",
              fields: [{
                name: "radios",
                label: "Radio Buttons",
                type: "radio_buttons",
                data: arrayDemo,
              },{
                name: "checkboxes",
                label: "Checkboxes",
                type: "check_boxes",
                data: arrayDemo,
              },{
                name: "select",
                label: "Select menu",
                type: "select",
                data: arrayDemo,
              }]
            },{
              name: "object",
              label: "Object collections",
              icon: "folder",
              message: "These are collections whose data is an object made of a <code>label</code> for the user-facing value, and a different <code>value</code> that is saved to the JSON.",
              fields: [{
                name: "radios",
                label: "Radio Buttons",
                type: "radio_buttons",
                data: objectDemo,
              },{
                name: "checkboxes",
                label: "Checkboxes",
                type: "check_boxes",
                data: objectDemo,
              },{
                name: "select",
                label: "Select menu",
                type: "select",
                data: objectDemo,
              }]
            }],
            debug: true,
            icons,
          }}
        >
          <ComposableContent />
        </Wrapper>
      );
    }
  )
  .add('Repeater', () => 
    <Wrapper
      title="Repeater fields"
      intro="<p>Using the <code>repeater</code> field type and <code>fields</code> you can create a simple repeater field.</p>"
      componentProps={{
        components: [{
          name: "gallery",
          label: "Gallery",
          icon: "image",
          fields: [{
            name: "gallery",
            label: "Gallery Images",
            type: "repeater",
            fields: [{
              name: "image_url",
              label: "Image URL",
            }]
          }]
        }],
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )
  .add('Conditional fields', () => 
    <Wrapper
      title="Conditional fields"
      intro={`
        <p>You can make fields conditional by using the <code>condition</code> property in the field. Conditions need a <code>when</code> and <code>is</code> property.</p>
        <p>eg. <code>{ when: 'user_name', is: 'Barry' }</code> will render the field when the field 'user_name' has the value 'Barry'.</p>
        <p>This feature is based on the <a href='https://codesandbox.io/s/lm4p3m92q' target='_blank'>react-final-form conditional fields demo</a>.</p>
        <p>Conditionals are only for editing and don't affect the JSON output.</p>
      `}
      componentProps={{
        components: [{
          name: "example",
          label: "Conditional Example",
          fields: [{
            name: "show_hidden",
            label: "Show hidden field",
            type: "boolean",
          },{
            name: "hidden_field",
            label: "This field only appears when the above is ticked",
            condition: {
              when: "show_hidden",
              is: true,
            }
          }]
        }],
        debug: true,
        icons,
      }}
    >
      <ComposableContent />
    </Wrapper>
  )

storiesOf('Integration', module)
  .add('onCompositionChange', () => 
    <Wrapper
      title="onCompositionChange"
      intro={`
        <p><code>onCompositionChange</code> is a callback prop you can use to do something whenever the composition JSON changes.</p>
        <pre class='code-pre'>
updateComposition = composition => {
  this.setState({
    composition
  })
}

render(){
  return(
    &lt;div>
      &lt;ComposableContent
        onCompositionChange={composition => this.updateComposition(composition)}
      />

      &lt;pre>{JSON.stringify(this.state.composition, null, 2)}&lt;/pre>
    &lt;/div>
  }
}</pre>
      `}
    >
      <IntegrationExample />
    </Wrapper>
  )
  .add('sectionifier helper', () => 
  <Wrapper
    title="sectionifier helper"
    intro={`
      <p>If you're using section components you can use the <code>sectionifier</code> helper to automatically group your JSON data in to sections for you.</p>
      <p>Each group (by deafult, just "main") will now have a top-level array of section components with <code>section_type</code> describing what sort of section it is and <code>section_data</code> listing the components that live in that section.</p>
      <pre class='code-pre'>
import ComposableContent, { sectionifier } from 'react-composable-content';

updateComposition = composition => {
  this.setState({
    composition: sectionifier(composition),
  })
}

render(){
  return(
    &lt;div>
      &lt;ComposableContent
        onCompositionChange={composition => this.updateComposition(composition)}
      />

      &lt;pre>{JSON.stringify(this.state.composition, null, 2)}&lt;/pre>
    &lt;/div>
  }
}</pre>
      <p>If the first component does not have a section above it, a new section will be automatically created for it using the default fallback of "container", this of course can be overridden in the second parameter which is an object of additional options:</p>
      <pre class='code-pre'>
sectionifier(composition, {
  defaultSection: "my-custom-fallback",
});</pre>
      <p>Use the <code>includeDrafts: true</code> option to include draft components. Drafts are ignored by default.</p>
    `}
  >
    <IntegrationExample
      sections={true}
    />
  </Wrapper>
  )