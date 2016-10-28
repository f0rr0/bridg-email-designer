import { List, Map } from 'immutable';
import uniqueid from 'lodash.uniqueid';
import getComponent from './get-component';

const deserialize = (canvas) => {
  const parsed = typeof canvas === 'string' ? JSON.parse(canvas) : canvas;
  let deserializedCanvas = List();
  parsed.forEach((row) => {
    let deserializedRow = Map().set('id', uniqueid());
    let deserializedColumns = List();
    row.forEach((column, index) => {
      let deserializedColumn = List();
      if (column) {
        column.forEach((content) => {
          const deserializedContent = Map()
           .set('type', content.type)
           .set('component', getComponent(content.type))
           .set('state', content.state);
          deserializedColumn = deserializedColumn.push(deserializedContent);
        });
      }
      deserializedColumns = deserializedColumns.set(index, deserializedColumn);
    });
    deserializedRow = deserializedRow.set('columns', deserializedColumns);
    deserializedCanvas = deserializedCanvas.push(deserializedRow);
  });
  return deserializedCanvas;
};

export default deserialize;
