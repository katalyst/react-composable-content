import React from 'react';
import { Field } from 'react-final-form';
import parameterize from 'parameterize';

export default class ComposableFieldSelect extends React.Component {
  render() {
    const options = this.props.fieldSettings.data || [];
    return(
      <Field
        component="select"
        {...this.props.helpers.generateFieldAttributes(this.props, {
          fallbackClassName: "form--auto"
        })}
      >
        {options.map(option => {
          return(
            <option value={option.value} key={"option__" + parameterize(option.value + "") }>{option.label}</option>
          );
        })}
      </Field>
    );
  }
}