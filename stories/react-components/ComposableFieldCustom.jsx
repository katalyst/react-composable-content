/*

  This is an example custom field type for Composable Content

  import ComposableFieldCustom from './Fields/ComposableFieldCustom';

  <Composable
    ...
    customFormFieldComponents={{
      ComposableFieldCustom,
    }}
  />

  There are several helper functions available to you in this file, all under
  this.props.helpers:
  
  generateFieldAttributes
  Generates HTML attributes you'd typically see on an <input> tag based on the
  composable field config

  getDefaultValueForField
  Gets a logical default value for a specific field type
  Probably not too helpful if you're developing something really custom

  getFieldValue
  Helper to get the current field value out of react-final-form

  setFieldValue
  Helper to set the current field value in react-final-form
  This is helpful if you have a programatic function that sets the value
  of a hidden input field

*/

import React from 'react';
import { Field } from 'react-final-form';

export default class ComposableFieldCustom extends React.Component {

  // When rendering our custom field, we want to take the formatted
  // JSON value and split it out in to the two fields
  componentDidMount(){
    const currentValue = this.props.helpers.getFieldValue(this.$hiddenField);

    // If the value has a comma present, we can assume
    // there is a first name and a last name
    if(currentValue.indexOf(",") > -1) {
      const split = currentValue.split(",");
      this.$lastName.value = split[0];
      if(split.length > 1) {
        this.$firstName.value = split[1];
      }

    // If there is no comma present, there is only
    // a first name
    } else {
      this.$firstName.value = currentValue;
    }
  }

  // When updating the field, format the value and send to 
  // react state
  handleChange = () => {
    const lastName = this.$lastName.value;
    let name = this.$firstName.value;
    // If only a first name, we just want to show the first name
    // If a last name is present we want to always put a comma
    // to separate them
    if(lastName) {
      name = `${lastName},${name}`;
    }
    this.props.helpers.setFieldValue(this.$hiddenField, name);
  }

  render() {
    return(
      <div className="form--field-wrapper">
        <input
          type="text"
          placeholder="First name"
          onChange={this.handleChange}
          ref={element => this.$firstName = element}
        />
        <input
          type="text"
          placeholder="Last name"
          onChange={this.handleChange}
          ref={element => this.$lastName = element}
        />
        <Field
          component="input"
          type="hidden"
          ref={element => this.$hiddenField = element}
          {...this.props.helpers.generateFieldAttributes(this.props)}
        />
      </div>
    );
  }
}