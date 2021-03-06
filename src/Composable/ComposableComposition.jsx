import React from "react";
import { ComposableContext } from './ComposableContext';
import ComposableComponent from "./ComposableComponent";

export default class ComposableComposition extends React.Component {
  static contextType = ComposableContext;

  render() {
    const { settings, state, functions } = this.context;

    if(state.composition[this.props.groupKey].length === 0) {
      return(
        <div className="composable--composition--empty">
          {functions.composition.getLangString("emptyComposition", "Drag a component here to start.")}
        </div>
      )
    } else {
      return state.composition[this.props.groupKey].map((component, index) => (
        <ComposableComponent
          key={component.id}
          component={component}
          index={index}
          template={functions.components.getTemplateForComponent(component.component_type)}
        />
      ))
    }
  }

};