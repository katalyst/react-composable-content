import React from 'react';
import { Field } from 'react-final-form';
import parameterize from 'parameterize';

export default class ComposableFieldCheckboxes extends React.Component {

  render() {
    const options = this.props.fieldSettings.data || [];
    return(
      <div className="checkboxes">
        {options.map((option, index) => {
          var key = parameterize(this.props.fieldSettings.name) + "__option-" + index + "__" + parameterize(option.value + "");
          return(
            <span className="checkbox" key={key}>
              <label>
                <Field
                  component="input"
                  type="checkbox"
                  value={option.value + ""}
                  {...this.props.helpers.generateFieldAttributes(this.props)}
                />
                <span className='form--enhanced--control'></span>
                {option.label}
              </label>
            </span>
          );
        })}
      </div>
    );
  }
}