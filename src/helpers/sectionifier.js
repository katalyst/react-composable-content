/*

  sectionifyGroup(compositionData, options);

  Options can include:

  defaultSection
  default: "container"
  If there's no section_type field in the section data it will fallback
  to this default section
  If the first component isn't a section it will create a new initial 
  section with this name

  includeDrafts
  default: false
  if true, all drafted components will be included, retaining the draft 
  flag in the JSON data
  if false, all drafted components will be skipped

  draftChildrenOfDraftedSections
  default: false
  If a section is drafted, set all children of that section to be drafted
  too, regardless of their individual drafted state
  Only applicable if includeDrafts is true

*/

function sectionifyGroup(composition, options={}) {
  const includeDrafts = options.includeDrafts || false;
  const defaultSection = options.defaultSection || "container";
  const draftChildrenOfDraftedSections = options.draftChildrenOfDraftedSections || false;

  const formatted = [];
  let currentSection = false;

  composition.forEach(_component => {
    const component = { ..._component };

    // Skip if skipping drafts
    if(!includeDrafts && component.component_draft) {
      return;
    }
    
    // If there's no initial section, let's create one
    if(!currentSection && component.component_type !== "section") {
      currentSection = {
        section_type: defaultSection,
        section_data: [],
      }
    }

    // If we hit a section, create a new section
    if(component.component_type === "section") {
      // push current page section to page sections if it's available
      if(currentSection) {
        formatted.push({ ...currentSection });
      }
      // Create a new section
      currentSection = {
        section_type: component.data.section_type || defaultSection,
        section_data: [],
        section_draft: component.component_draft,
        advanced: component.advanced || [],
      }

    // If it's not a section, push to the current section_data
    } else {
      // If children should be drafted to the same state as the section
      // we can do that here
      if(draftChildrenOfDraftedSections && currentSection.section_draft) {
        component.component_draft = currentSection.section_draft;
      }
      // Remove unnecessary UI states
      delete component.component_collapsed;
      // Push to current section
      currentSection.section_data.push(component);
    }
  });

  // Push the last section to the formatted array
  if(currentSection && formatted.indexOf(currentSection) < 0) {
    formatted.push(currentSection);
  }

  return formatted;
}

// Loop over all groups and format
export default function sectionifier(composition={}, options={}) {
  const formatted = {};
  Object.keys(composition).forEach(key => {
    formatted[key] = sectionifyGroup(composition[key]);
  });
  return formatted;
}