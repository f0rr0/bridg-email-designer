import { List, Map } from 'immutable';

const serializeColumn = (column) => {
  let state = List();
  column.forEach((content) => {
    const serializedContent = Map()
     .set('type', content.get('type'))
     .set('state', content.get('component').serialize());
    state = state.push(serializedContent);
  });
  return state;
};

const serializeRow = (row) => {
  let state = List();
  const columns = row.get('columns');
  columns.forEach((column) => {
    state = state.push(serializeColumn(column));
  });
  return state;
};

const serializeCanvas = (canvas) => {
  let state = List();
  canvas.forEach((row) => {
    state = state.push(serializeRow(row));
  });
  return state;
};

const serialize = canvas => serializeCanvas(canvas);

export default serialize;
