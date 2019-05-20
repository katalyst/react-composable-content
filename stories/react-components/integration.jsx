import React from 'react';
import ComposableContent, { sectionifier } from '../../src/index';
import * as icons from '../../src/icons';

export default class IntegrationExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {},
    }
  }

  updateContent = content => {
    if(this.props.sections) {
      this.setState({ content: sectionifier(content) });
    } else {
      this.setState({ content });
    }
  }

  render(){
    const components = [];

    if(this.props.sections) {
      components.push({
        name: "section",
        label: "Section",
        icon: "section",
        fields: [{
          name: "section_type",
          type: "select",
          data: ["full-width", "container", "callout"],
        }]
      })
    }
    
    components.push({
      name: "example_component",
      label: "Example Component",
      fields: [{
        name: "string",
        label: "String field",
      }]
    });

    return(
      <div>
        <ComposableContent
          components={components}
          onCompositionChange={content => this.updateContent(content)}
          draftMode={true}
          icons={icons}
        />
        <h2>Output</h2>
        <p>This is an external <code>pre</code> tag that gets populated with the JSON data when it changes:</p>
        <pre>{JSON.stringify(this.state.content, null, 2)}</pre>
      </div>
    )
  }
}