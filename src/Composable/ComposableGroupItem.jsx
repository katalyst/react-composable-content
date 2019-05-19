import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ComposableContext } from './ComposableContext';
import ComposableLibrary from "./ComposableLibrary";
import ComposableComposition from "./ComposableComposition";

export default class ComposableGroupItem extends React.Component {
  static contextType = ComposableContext;

  render() {
    const { settings, state, functions } = this.context;
    const composition = state.composition[this.props.groupKey];
    const hasSection = composition.length && composition.filter(component => component.component_type === "section").length > 0;

    return(
      <DragDropContext
        onDragStart={functions.dnd.onDragStart}
        onDragUpdate={functions.dnd.onDragUpdate}
        onDragEnd={(result, provided) => functions.dnd.onDragEnd(result, provided, this.props.groupKey)}
      >
        <div className="composable--header">
          <button type="button" onClick={e => functions.components.collapseAllComponents(true)}>
            {functions.composition.getLangString("collapseAll", "Collapse All")}
          </button>
          <button type="button" onClick={e => functions.components.collapseAllComponents()}>
            {functions.composition.getLangString("revealAll", "Reveal All")}
          </button>
        </div>
        <div className={`composable ${hasSection ? "composable__with-sections" : ""}`}>
          <div className="composable--composition">
            <Droppable droppableId="composition" ignoreContainerClipping={true}>
              {(compositionProvided, compositionSnapshot) => (
                <div ref={compositionProvided.innerRef} className={`${compositionSnapshot.isDraggingOver ? "composable--composition--drag-space" : ""}`}>
                  <ComposableComposition
                    groupKey={this.props.groupKey}
                  />
                  {compositionProvided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <ComposableLibrary
            composableTypes={functions.composition.getConfig()[this.props.groupKey]}
          />
        </div>
      </DragDropContext>
    )
  }
}