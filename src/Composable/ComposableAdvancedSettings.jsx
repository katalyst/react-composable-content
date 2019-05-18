import React from 'react';
import { Field } from 'react-final-form';
import { ComposableContext } from './ComposableContext';

export default class ComposableAdvancedSettings extends React.Component {
  static contextType = ComposableContext;

  render() {
    return(
      <div className="inputs">
        <p><strong>Advanced Settings</strong></p>
        { this.context.settings.advancedSettings.map(field => (
          <div className="control-group" key={field.name}>
            <label className="control-label">{field.label}</label>
            {field.hint &&
              <p className="hint-block">{field.hint}</p>
            }
            <div className="controls">
              <Field
                name={field.name}
                component="input"
                className={field.className || "form--medium"}
                type="text"
              />
            </div>
          </div>
        ))}
        <div>
          <button onClick={this.props.closeAdvanced} className="button__primary">‹ Close advanced settings</button>
        </div>
      </div>
    )
  }
}