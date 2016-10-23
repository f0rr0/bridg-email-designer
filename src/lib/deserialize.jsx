import React from 'react';
import uniqueid from 'lodash.uniqueid';
import { fromJS } from 'immutable';
import getComponent from './get-component';

// const populateWithContent = column =>
//   column.map((content) => {
//     const ComponentForType = getComponent(content.type);
//     return (
//       // <ComponentForType
//       //   type={content.type.toUpperCase()}
//       //   inCanvas
//       //   state={content.state}
//       // />
//       content
//     );
//   });

const deserialize = canvas =>
  fromJS(canvas.map(row => ({
    id: uniqueid(),
    columns: row
    // columns: row.map(column => populateWithContent(column))
  })));

export default deserialize;
