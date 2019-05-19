const demoComponents = [{
  name: "component1",
  label: "Component 1",
  icon: "user",
  fields: [{
    name: "first_name",
    label: "First name",
  },{
    name: "last_name",
    label: "Last name",
  }]
},{
  name: "component2",
  label: "Component 2",
  icon: "stack",
  fields: [{
    name: "number",
    label: "Number of items",
    type: "select",
    data: [1,2,3,4,5,6],
  },{
    name: "is_active",
    label: "Active",
    type: "boolean",
  }]
},{
  name: "component3",
  label: "Component 3",
  icon: "paragraph",
  fields: [{
    name: "heading",
    label: "Heading",
  },{
    name: "body",
    label: "Content",
    type: "textarea",
  }]
}]

// Helper to get an array of components by name
// getComponents(["component1"]) => [{ name: "component1", ...etc }]
const getDemoComponents = names => {
  return names.map(name => demoComponents.find(component => component.name === name));
}

export { demoComponents, getDemoComponents };