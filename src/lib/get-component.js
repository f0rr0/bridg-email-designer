import capitalize from 'lodash.capitalize';
import manifest from './manifest';

const contentTypes = Object.values(manifest).filter(type => type !== 'ROW');

const getComponentForType = (type) => {
  if (!contentTypes.includes(type.toUpperCase())) {
    throw new Error(`${type.toUpperCase()} is not defined in lib/types`);
  }
  const path = capitalize(type);
  try {
    const ComponentForType = require('../components/' + path).default; // eslint-disable-line
    return ComponentForType;
  } catch (e) {
    throw new Error(`${path}.jsx does not exist in src/components`);
  }
};

export { contentTypes };
export default getComponentForType;
