import React from 'react';
import ComposableContent from '../../src/index';
import * as icons from '../../src/icons';

export default class IntegrationExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {},
    }
  }

  updateContent = content => {
    this.setState({ content });
  }

  render(){
    return(
      <div>
        <ComposableContent
          components={[{
            name: "example_component",
            label: "Example Component",
            fields: [{
              name: "string",
              label: "String field",
            }]
          }]}
          onCompositionChange={content => this.updateContent(content)}
        />
        <h2>Output</h2>
        <p>This is an external <code>pre</code> tag that gets populated with the JSON data when it changes:</p>
        <pre>{JSON.stringify(this.state.content, null, 2)}</pre>
      </div>
    )
  }
}