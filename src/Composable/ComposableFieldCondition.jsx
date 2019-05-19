import React from 'react';
import { Field } from 'react-final-form';

// Small little conditinoal function for showing/hiding fields
// based on other input
// https://codesandbox.io/s/lm4p3m92q
const ComposableFieldCondition = ({ field, children }) => {
  if(field.condition) {
    if(field.condition.when && field.condition.is) {
      return(
        <Field name={field.condition.when} subscription={{ value: true }}>
          {({ input: { value } }) => {
            return(value === field.condition.is ? children : null)
          }}
        </Field>
      )

    // Nice error message when malformed conditional
    } else {
      return(
        <div>
          <div>
            Error: Malformed conditional, doesn't have `when` and `is` properties.
          </div>
          {children}
        </div>
      );
    }

  // If no conditional, just render children
  } else {
    return children
  }
}

export default ComposableFieldCondition;