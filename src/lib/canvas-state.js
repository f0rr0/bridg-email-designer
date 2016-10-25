import { fromJS, List, Map } from 'immutable';
import uniqueid from 'lodash.uniqueid';
import curry from 'lodash.curry';
import getComponent from './get-component';
import manifest from './manifest';

const create = (savedState) => {
  if (savedState) {
    let state = List();
    savedState.forEach((row) => {
      let newRow = Map().set('id', uniqueid());
      let newColumns = List();
      row.forEach((column) => {
        let newColumn = List();
        column.forEach((component) => {
          const newComponent = Map().set('type', component.type)
            .set('component', getComponent(component.type))
            .set('state', component.state);
          newColumn = newColumn.push(newComponent);
        });
        newColumns = newColumns.push(newColumn);
      });
      newRow = newRow.set('columns', newColumns);
      state = state.push(newRow);
    });
    return state;
  }
  return List();
};

const findRow = (canvas, rowId) => {
  let found = -1;
  canvas.map((row, index) => {
    if (row && row.get('id') === rowId) {
      found = index;
      return row;
    }
    return row;
  });
  return found;
};

const removeRow = (canvas, rowId) => {
  const index = findRow(canvas, rowId);
  if (index >= 0) {
    return canvas.delete(index);
  }
  return canvas;
};

const addRow = (canvas, numCols) => {
  const newRow = fromJS({
    id: uniqueid(),
    columns: Array(numCols).fill(List())
  });
  return canvas.push(newRow);
};

const addContent = (canvas, rowId, colIndex, content) => {
  const rowIndex = findRow(canvas, rowId);
  if (rowIndex >= 0) {
    const currRow = canvas.get(rowIndex);
    const currColumns = currRow.get('columns');
    const currContent = currColumns.get(colIndex);
    const modifiedContent = currContent.push(fromJS({
      type: content.type,
      component: getComponent(content.type)
    }));
    const modifiedColumns = currColumns.set(colIndex, modifiedContent);
    const modifiedRow = currRow.set('columns', modifiedColumns);
    return canvas.set(rowIndex, modifiedRow);
  }
  return canvas;
};

const updateRef = (canvas, rowId, colIndex, components) => {
  const rowIndex = findRow(canvas, rowId);
  if (rowIndex >= 0) {
    const currRow = canvas.get(rowIndex);
    const currColumns = currRow.get('columns');
    const modifiedContent = fromJS(components);
    const modifiedColumns = currColumns.set(colIndex, modifiedContent);
    const modifiedRow = currRow.set('columns', modifiedColumns);
    return canvas.set(rowIndex, modifiedRow);
  }
  return canvas;
};

const getContentsForColumn = (canvas, rowId, colIndex) => {
  const rowIndex = findRow(canvas, rowId);
  if (rowIndex >= 0) {
    const row = canvas.get(rowIndex);
    const contents = row.get('columns').get(colIndex);
    return contents;
  }
  return List();
};

const getPropsForColumn = (canvas, rowId, numCols, colIndex) => ({
  numCols,
  rowId,
  colIndex,
  contents: getContentsForColumn(canvas, rowId, colIndex)
});

const getPropsForRow = (canvas, row) => ({
  type: manifest.ROW,
  key: row.get('id'),
  numCols: row.get('columns').size,
  id: row.get('id'),
  findRow: curry(findRow)(canvas),
  getPropsForColumn: curry(getPropsForColumn)(canvas, row.get('id'), row.get('columns').size)
});

export {
  create,
  findRow,
  removeRow,
  addRow,
  addContent,
  updateRef,
  getPropsForRow
};
