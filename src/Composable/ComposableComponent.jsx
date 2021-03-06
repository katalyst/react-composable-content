import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Form, FormSpy, Field } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { ComposableContext } from './ComposableContext';
import ComposableField from './ComposableField';
import ComposableAdvancedSettings from './ComposableAdvancedSettings';
import Condition from './ComposableFieldCondition';

export default class ComposableComponent extends React.Component {
  static contextType = ComposableContext;
  
  constructor(props) {
    super(props);
    this.state = {
      advancedVisible: false,
    }
    this.onFormChange = this.onFormChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.toggleAdvanced = this.toggleAdvanced.bind(this);
    this.closeAdvanced = this.closeAdvanced.bind(this);
    this.onAdvancedFormChange = this.onAdvancedFormChange.bind(this);
  }

  componentDidMount(){
    document.addEventListener("composable-content:validate", this.validateForm);
  }

  componentWillUnmount(){
    document.removeEventListener("composable-content:validate", this.validateForm);
  }

  // =========================================================================
  // Advanced settings
  // =========================================================================

  toggleAdvanced = () => {
    this.setState({
      advancedVisible: !this.state.advancedVisible,
    });
  }

  closeAdvanced = () => {
    this.setState({
      advancedVisible: false,
    });
  }

  onAdvancedFormChange = props => {
    const composition = { ...this.context.state.composition };
    composition[this.context.state.group][this.props.index].advanced = props.values;
    this.context.functions.composition.replaceComposition(composition);
  }

  // =========================================================================
  // Form hooks
  // =========================================================================

  onFormChange = props => {
    const composition = { ...this.context.state.composition };
    composition[this.context.state.group][this.props.index].data = props.values;
    this.context.functions.composition.replaceComposition(composition);
  }

  validateForm = () => {
    this.form.handleSubmit();
    // If form is invalid (eg. validation errors) and the component is collapsed,
    // open the component back up so we can focus on the error
    if(!this.form.state.state.valid && this.props.component.component_collapsed) {
      this.context.functions.components.collapseComponent(this.props.index, "show");
    }
  }

  // =========================================================================
  // Render
  // =========================================================================

  render() {
    const { component, index, template } = this.props;
    const contextSettings = this.context.settings;
    const contextState = this.context.state;
    const functions = this.context.functions;
    const hasFields = template && template.fields && template.fields.length;

    let preview = "";
    if(hasFields && template.primary) {
      const primaryField = template.primary;
      const primaryFieldSettings = template.fields.filter(field => field.name === primaryField)[0];
      preview = component.data[primaryField] || false;

      // If field has data (eg. select field)
      if(primaryFieldSettings.data) {
        const object = primaryFieldSettings.data.filter(datum => datum.value + "" === preview + "")[0];
        if(object && object.label) {
          preview = object.label;
        }
      }

      // If preview is potentially an object (eg. select values)
      if(typeof preview === "object") {
        preview = "[object]";
      }

      // Shorten preview
      if(preview.length > 120) {
        preview = preview.slice(0, 120);
      }
    }

    let componentMessage = false;
    if(!hasFields || this.props.template.message) {
      let componentMessageClass = "composable--component--message panel--padding content";
      let componentMessageContent = this.props.template.message;
      if(!hasFields && !componentMessageContent) {
        componentMessageContent = "<p>This component doesn't require configuration.</p>";
      }
      if(this.props.template.messageType === "passive") {
        componentMessageClass += " bg__passive"
      }
      // Wrap all messages in <p> tags if they don't start with a "<"
      if(componentMessageContent.trim()[0] !== "<") {
        componentMessageContent = `<p>${componentMessageContent}</p>`;
      }
      componentMessage = 
        <div className={componentMessageClass} dangerouslySetInnerHTML={{__html: componentMessageContent}}></div>
    }

    return(
      <Draggable key={component.id} draggableId={component.id} index={index}>
        {(draggableProvided, draggableSnapshot) => (
          <div
            ref={draggableProvided.innerRef}
            data-component-id={component.id}
            className="composable--component--wrapper"
            {...draggableProvided.draggableProps}
          >
            <div
              className={`
                composable--component 
                composable--component__${component.component_type}
                ${draggableSnapshot.isDragging ? "composable--component__dragging" : ""} 
                ${component.component_collapsed ? "composable--component__collapsed" : ""} 
                ${component.component_draft ? "composable--component__draft" : ""} 
                ${this.state.advancedVisible ? "composable--component__advanced" : ""} 
              `}
            >
              {component.component_draft &&
                <div className="composable--component--draft-banner">
                  {functions.composition.getLangString("draftModeBanner", "Draft mode")}
                </div>
              }
              <div className="composable--component--meta">
                <div className="composable--component--meta--label">
                  {contextSettings.icons &&
                    <React.Fragment>
                      {this.props.template.icon && contextSettings.icons[this.props.template.icon]
                        ? <div
                            className="composable--component--meta--label-icon"
                            dangerouslySetInnerHTML={{__html: contextSettings.icons[this.props.template.icon]}}
                          ></div>
                        : <div
                            className="composable--component--meta--label-icon"
                            dangerouslySetInnerHTML={{__html: contextSettings.icons.module}}
                          ></div>
                      }
                    </React.Fragment>
                  }
                  <strong>{template.label || template.name || component.section_type}</strong>
                </div>
                <div className="composable--component--preview grey small">
                  <div>
                    <span>{preview}</span>
                  </div>
                </div>
                {contextSettings.advancedSettings &&
                  <button
                    type="button"
                    onClick={e => this.toggleAdvanced()}
                    title={this.state.advancedVisible ? "Hide advanced settings" : "Show advanced settings"}
                    className="composable--component--meta--section composable--component--meta--section__advanced composable--component--meta--icon disable-mouse-outline"
                  >
                    {functions.components.getIcon("cog", "Advanced")}
                  </button>
                }
                {functions.composition.hasDraftMode() &&
                  <button
                    type="button"
                    className="composable--component--meta--section composable--component--meta--section__draft composable--component--meta--icon disable-mouse-outline"
                    onClick={e => functions.components.draftComponent(index)}
                    title={component.component_draft ? "Disable draft mode" : "Enable draft mode"}
                  >
                    {component.component_draft
                      ? <React.Fragment>{functions.components.getIcon("hidden", "Publish")}</React.Fragment>
                      : <React.Fragment>{functions.components.getIcon("visible", "Draft")}</React.Fragment>
                    }
                  </button>
                }
                <button
                  type="button"
                  onClick={e => functions.composition.removeComponent(component)}
                  className="composable--component--meta--section composable--component--meta--text-action disable-mouse-outline"
                  aria-label="Remove this component"
                >{functions.composition.getLangString("remove", "Remove")}</button>
                <button
                  type="button"
                  className="composable--component--meta--section composable--component--meta--collapser disable-mouse-outline"
                  onClick={e => functions.components.collapseComponent(index)}
                ></button>
                <div
                  className="composable--component--meta--section composable--component--meta--drag"
                  {...draggableProvided.dragHandleProps}
                >☰</div>
              </div>
              {!component.component_collapsed && this.state.advancedVisible &&
                <div className="composable--component--advanced panel--padding">
                  <Form
                    onSubmit={e => false}
                    ref={el => this.advancedForm = el}
                    initialValues={ contextState.composition[contextState.group][this.props.index].advanced }
                    render={({ handleSubmit, form, values }) => (
                      <React.Fragment>
                        <FormSpy subscription={{ values: true }} onChange={this.onAdvancedFormChange} />
                        <ComposableAdvancedSettings
                          closeAdvanced={this.closeAdvanced}
                        />
                      </React.Fragment>
                    )}
                  />
                </div>
              }
              <Form
                onSubmit={e => false}
                mutators={{
                  ...arrayMutators,
                }}
                ref={el => this.form = el}
                initialValues={ contextState.composition[contextState.group][this.props.index].data }
                validate={values => {
                  if(!template || !template.fields) {
                    return;
                  }
                  return functions.components.validateComponent(template, values);
                }}
                render={({ handleSubmit, form, submitting, pristine, values }) => (
                  <React.Fragment>
                    <FormSpy subscription={{ values: true }} onChange={this.onFormChange} />
                    <div style={{ display: (component.component_collapsed || this.state.advancedVisible) ? "none" : "block" }}>
                      {!template &&
                        <div className="composable--component--body">
                          <div className="panel__error panel--padding">Unknown component type: {component.component_type}</div>
                        </div>
                      }
                      {componentMessage}
                      {hasFields &&
                        <div className="composable--component--body">
                          <div className="inputs">
                            <Field name="componentError" subscription={{ error: true, touched: true }}>
                              {({ meta: { error,touched } }) => {
                                if(error) {
                                  return(
                                    <div className="panel__error panel--padding">
                                      <span className="error-block" dangerouslySetInnerHTML={{ __html: error }}></span>
                                    </div>
                                  );
                                } else {
                                  return(null);
                                }
                              }}
                            </Field>
                            {template.fields.map((field, index) => {
                              return(
                                <Condition field={field} key={`${component.id}_${field.name}`}>
                                  <ComposableField
                                    key={`${component.id}_${field.name}`}
                                    onFormChange={this.onFormChange}
                                    formValue={values}
                                    componentIndex={this.props.index}
                                    component={component}
                                    field={field}
                                  />
                                </Condition>
                              )
                            })}
                          </div>
                        </div>
                      }
                    </div>
                  </React.Fragment>
                )}
              />
            </div>
          </div>
        )}
      </Draggable>
    );
  }
}
