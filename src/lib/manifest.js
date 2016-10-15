import types from './types.js';

const manifest = {};

types.forEach((type) => {
  manifest[type] = type;
});

export default manifest;
