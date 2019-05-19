import { configure, addDecorator, addParameters } from '@storybook/react';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addParameters({
  options: {
    showPanel: false,
    panelPosition: "right",
  }
});
configure(loadStories, module);