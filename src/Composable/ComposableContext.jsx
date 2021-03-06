import React from "react";
import { setupValidationRules, validate } from './ComposableValidations';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// Create the context item
export const ComposableContext = React.createContext({});

// Create the provider
export class ComposableProvider extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      composition: this.initialiseComposition(),
      group: this.getInitialGroup(),
      debug: this.props.debug || false,
      error: false,
    }
  }

  componentDidMount(){
    setupValidationRules(this.props.customValidations);
    if(this.props.onMount) {
      this.props.onMount(this);
    }
  }

  componentDidCatch(error, info) {
    this.setState({
      error: { error, info }
    });
  }

  // =========================================================================
  // Helpers
  // =========================================================================

  setRef = (name, element) => {
    this[name] = element;
  }

  // Render an icon or fallback text
  // getIcon("visible", "Draft Mode");
  // if icons["visible"] -> icons["visible"]
  // else "Draft Mode"
  getIcon = (name, fallback) => {
    if(this.props.icons && this.props.icons[name]) {
      return <span dangerouslySetInnerHTML={{ __html: this.props.icons[name] }}></span>
    } else if(fallback) {
      return fallback;
    } else {
      return false;
    }
  }

  getLangString = (name, fallback) => {
    if(this.props.lang && this.props.lang[name]) {
      return this.props.lang[name];
    } else {
      return fallback;
    }
  }

  // =========================================================================
  // Debug mode
  // =========================================================================

  // setDebug(true) => Turns debug mode on
  // setDebug() => Turns debug mode off
  setDebug = debug => {
    this.setState({
      debug,
    });
  }

  // =========================================================================
  // Groups
  // =========================================================================

  // Switch between a different active group
  setGroup = group => {
    this.setState({
      group,
    });
  }

  // Simple helper to get the first group key
  getInitialGroup = () => {
    const config = this.getConfig();
    return Object.keys(config)[0];
  }

  getComposition = group => {
    if(group) {
      return this.state.composition[group];
    } else {
      return this.state.composition;
    }
  }

  getGroups = () => {
    const config = this.getConfig();
    return Object.keys(config);
  }

  hasGroups = () => {
    return this.getGroups().length > 1;
  }

  // =========================================================================
  // Data structures
  // =========================================================================

  getConfig = () => {
    if(this.props.config) {
      return this.props.config;
    } else if(this.props.components) {
      return { main: this.props.components.map(component => component.name) };
    }
  }

  // Build out a nested JSON structure for all groups
  // If there is a new group added in the crud config, this will ensure that
  // it doesn't crash when trying to render the new group by initialising
  // and empty array in the JSON named for that group
  // It will merge in any existing data for groups that already exist
  // => { group1: [], group2: [], group3: this.props.composition.group3 }
  initialiseComposition = () => {
    const structure = {};
    const existing = this.props.composition;
    const config = this.props.config || { main: [] };
    Object.keys(config).forEach(key => {
      if(existing && existing[key]) {
        structure[key] = existing[key];
      } else {
        structure[key] = [];
      }
    });
    this.compositionChangeCallback(structure);
    return structure;
  }

  // Simply replace the entire composition with a new value
  replaceComposition = composition => {
    this.setState({
      composition,
    }, () => {
      this.compositionChangeCallback();
    });
  }

  compositionChangeCallback = (composition) => {
    if(this.props.onCompositionChange) {
      this.props.onCompositionChange(composition || this.state.composition);
    }
  }

  // Get the DataType template for a field type name
  // eg. "heading" -> composableTypes.where("type": "heading")
  getTemplateForComponent = fieldType => {
    return this.props.components.filter(template => template.name === fieldType)[0] || 
    // If there's no valid template for the component, we can generate one to at least
    // not crash the UI due to bad config
    {
      id: fieldType,
      name: fieldType,
      label: `${fieldType} (Missing)`,
      message: `
        Error: The component '${fieldType}' is allowed in your config but is not present in the components prop.
      `,
      messageType: "error",
    };
  }

  deleteAllData = () => {
    if(confirm("Are you sure you want to delete all data for this record? There is no going back.")) {
      this.setState({
        composition: this.initialiseComposition(),
      });
    }
  }

  // =========================================================================
  // Adding/Removing composable components
  // =========================================================================

  addNewComponent = (type, atIndex=false) => {
    const component = this.getTemplateForComponent(type);

    let composition = this.state.composition;

    // Create a component structure
    let newComponent = {
      id: Date.now(),
      component_type: component.name,
      component_collapsed: false,
      advanced: {},
      data: {},
    }

    if(this.hasDraftMode()) {
      newComponent.component_draft = false;
    }

    // Add default data for this component
    if(component.fields) {
      component.fields.forEach(template => {
        // Defaulting to empty
        newComponent.data[template.name] = this.getDefaultValueForField(template);
      });
    }

    // Push and setState
    if(atIndex !== false) {
      composition[this.state.group].splice(atIndex, 0, newComponent);
    } else {
      composition[this.state.group].push(newComponent);
    }
    this.setState({
      composition,
    }, () => {
      this.compositionChangeCallback();
      if(this.props.onComponentAdd) {
        this.props.onComponentAdd();
      }
    });
  }

  removeComponent = component => {
    if(confirm("Are you sure you want to remove this component?")) {
      let composition = this.state.composition;
      let index = composition[this.state.group].indexOf(component);
      composition[this.state.group].splice(index, 1);
      this.setState({
        composition,
      },() => {
        this.compositionChangeCallback();
        // After component remove
      });
    }
  }

  // =========================================================================
  // Setting flags on components
  // eg. draft mode, collapse etc.
  // =========================================================================

  // toggle - collapseComponent(12);
  // collapse - collapseComponent(12, "collapse");
  // show - collapseComponent(12, "show");
  collapseComponent = (componentIndex, direction) => {
    const composition = this.state.composition;
    const component = composition[this.state.group][componentIndex];
    if(!component) {
      console.warn("Unable to find component with index of " + componentIndex);
      return;
    }
    if(direction) {
      component.component_collapsed = direction === "collapse" ? true : false;
    } else {
      component.component_collapsed = !component.component_collapsed;
    }
    this.setState({
      composition,
    }, () => {
      this.compositionChangeCallback();
    });
  }

  collapseAllComponents = collapse => {
    const composition = this.state.composition;
    composition[this.state.group].map(component => {
      component.component_collapsed = collapse;
    });
    this.setState({
      composition,
    }, () => {
      this.compositionChangeCallback();
    });
  }

  // Helper to check if draft mode is available
  hasDraftMode = () => {
    return this.props.draftMode;
  }

  // toggle - draftComponent(10);
  // draft - draftComponent(10, "draft");
  // undraft - draftComponent(10, "enable");
  draftComponent = (componentIndex, visibility) => {
    const composition = this.state.composition;
    const component = composition[this.state.group][componentIndex];
    if(!component) {
      console.warn("Unable to find component with index of " + componentIndex);
      return;
    }
    if(visibility) {
      component.component_draft = visibility === "draft" ? true : false;
    } else {
      component.component_draft = !component.component_draft;
    }
    this.setState({
      composition,
    }, () => {
      this.compositionChangeCallback();
    });
  }

  // =========================================================================
  // Field data structures
  // =========================================================================

  // Get current value from React-Final-Forms API
  // Note: This changes in v5+ and will need to be rewritten if
  // upgrading
  getFieldValue = ref => {
    if(ref.state) {
      if(ref.state.state) {
        return ref.state.state.value;
      } else if(ref.state.value) {
        return ref.state.value;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // Set current value using the React-Final-Forms API
  // Note: This changes in v5+ and will need to be rewritten if
  // upgrading
  setFieldValue = (ref, value) => {
    ref.context.reactFinalForm.change(ref.props.name, value);
  }

  // Get the default value for a field type
  // takes in to account defaultValue prop, data type etc.
  getDefaultValueForField = field => {
    // Defaulting to empty string
    let value = "";
    let arrayTypes = ["repeater"];
    let objectTypes = [];

    // Default to defaultValue if required
    if(field.defaultValue) {
      value = field.defaultValue;

    } else if(field.type === "boolean") {
      value = false;

    // Non-string defaults
    } else if(arrayTypes.indexOf(field.type) > -1) {
      value = [];

    } else if(objectTypes.indexOf(field.type) > -1) {
      value = {};
      
    // Default to first item in select menu
    } else if(field.type === "select" && field.data) {
      let firstValue = field.data[0];
      if(typeof field.data[0].value !== "undefined") {
        firstValue = firstValue.value;
      }
      value = firstValue + "";
    }

    return value;
  }

  // =========================================================================
  // Field attribute helpers
  // =========================================================================

  // Take a list of props and generate the attributes for an input field
  generateFieldAttributes = (props, options={}) => {
    const settings = props.fieldSettings;
    const attributes = {
      id: props.id,
      name: settings.name,
    }
    if(options.namePostfix) {
      attributes.name += options.namePostfix;
      attributes.id += options.namePostfix;
    }
    if(settings) {
      attributes.className = settings.className || options.fallbackClassName || "";
      attributes.placeholder = settings.placeholder || "";
      if(settings.required) {
        attributes.required = settings.required;
      }
      if(settings.inputData) {
        Object.keys(settings.inputData).forEach(key => {
          attributes["data-" + key] = settings.inputData[key];
        });
      }
    }
    return {
      ...attributes,
      ...settings.fieldAttributes,
    }
  }

  // =========================================================================
  // Drag and Drop functions
  // =========================================================================

  onDragStart = (start, provided) => {
    if(this.props.onDragStart) {
      this.props.onDragStart(start, provided)
    }
  }

  onDragUpdate = () => {
    if(this.props.onDragUpdate) {
      this.props.onDragUpdate();
    }
  }

  onDragEnd = (result, provided) => {
    const { source, destination } = result;

    // Dropped outside of list
    if(!destination) {
      return;
    }

    // Dropped on composition
    if(destination.droppableId !== "library") {

      // Create new component
      if(source.droppableId === "library") {
        this.addNewComponent(result.draggableId, destination.index);

      // Reorder
      } else {
        const composition = { ...this.state.composition };
        composition[this.state.group] = reorder(
          composition[this.state.group],
          source.index,
          destination.index,
        );
        this.setState({
          composition,
        }, () => {
          this.compositionChangeCallback();
          if(this.props.onDragEnd) {
            this.props.onDragEnd(result, provided);
          }
        });
      }
    }
  }

  // =========================================================================
  // Render
  // =========================================================================

  render(){
    return(
      <ComposableContext.Provider
        value={{
          settings: this.props,
          state: this.state,
          functions: {
            setRef: this.setRef,
            composition: {
              getConfig: this.getConfig,
              getComposition: this.getComposition,
              addNewComponent: this.addNewComponent,
              removeComponent: this.removeComponent,
              replaceComposition: this.replaceComposition,
              deleteAllData: this.deleteAllData,
              getGroups: this.getGroups,
              setGroup: this.setGroup,
              hasGroups: this.hasGroups,
              hasDraftMode: this.hasDraftMode,
              getLangString: this.getLangString,
            },
            dnd: {
              onDragStart: this.onDragStart,
              onDragUpdate: this.onDragUpdate,
              onDragEnd: this.onDragEnd,
            },
            fields: {
              generateFieldAttributes: this.generateFieldAttributes,
              getDefaultValueForField: this.getDefaultValueForField,
              getFieldValue: this.getFieldValue,
              setFieldValue: this.setFieldValue,
            },
            components: {
              getTemplateForComponent: this.getTemplateForComponent,
              collapseComponent: this.collapseComponent,
              collapseAllComponents: this.collapseAllComponents,
              draftComponent: this.draftComponent,
              closeAdvanced: this.closeAdvanced,
              validateComponent: validate,
              getIcon: this.getIcon,
            }
          },
        }}
      >
        {this.props.children}
      </ComposableContext.Provider>
    );
  }

}