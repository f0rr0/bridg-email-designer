const serializeColumn = (column) => {
  const state = [];
  column.forEach((content) => {
    state.push({
      type: content.get('type'),
      state: content.get('component').state
    });
  });
  return state;
};

const serializeRow = (row) => {
  const state = [];
  if (row) {
    const columns = row.get('columns');
    columns.forEach((column) => {
      state.push(serializeColumn(column));
    });
  }
  return state;
};

const serializeCanvas = (canvas) => {
  const state = [];
  canvas.forEach((row) => {
    state.push(serializeRow(row));
  });
  return state;
};

const serialize = canvas => serializeCanvas(canvas);

export default serialize;
