import { fromJS, List, Stack } from 'immutable';
import uniqueid from 'lodash.uniqueid';
import curry from 'lodash.curry';
import getComponent from './get-component';
import deserialize from './deserialize';
import manifest from './manifest';

const create = (savedState) => {
  if (savedState) {
    return deserialize(savedState);
  }
  return List();
};

const createStack = () => Stack();

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

const reorderRows = (canvas, fromId, position, toId, inCanvas) => {
  const fromIndex = findRow(canvas, fromId);
  const toIndex = findRow(canvas, toId);
  const row = canvas.get(fromIndex);
  if (inCanvas) {
    if (position === 'before') {
      if (fromIndex === 0) {
        return canvas;
      } else if (fromIndex > toIndex) {
        return canvas.splice(fromIndex, 1).splice(toIndex, 0, row);
      }
      return canvas;
    } else if (fromIndex === canvas.size - 1) {
      return canvas;
    } else if (fromIndex < toIndex) {
      return canvas.splice(fromIndex, 1).splice(toIndex, 0, row);
    }
  }
  return canvas;
};

const addContent = (canvas, rowId, colIndex, content) => {
  const rowIndex = findRow(canvas, rowId);
  if (rowIndex >= 0) {
    const currRow = canvas.get(rowIndex);
    const currColumns = currRow.get('columns');
    const currContent = currColumns.get(colIndex);
    const modifiedContent = currContent.push(fromJS({
      type: content.type,
      // id: uniqueid(),
      component: getComponent(content.type)
    }));
    const modifiedColumns = currColumns.set(colIndex, modifiedContent);
    const modifiedRow = currRow.set('columns', modifiedColumns);
    return canvas.set(rowIndex, modifiedRow);
  }
  return canvas;
};

// const removeContent = (canvas, rowId, colIndex, contentId) => {
//   const rowIndex = findRow(canvas, rowId);
//   if (rowIndex >= 0) {
//     const currRow = canvas.get(rowIndex);
//     const currColumns = currRow.get('columns');
//     const currContent = currColumns.get(colIndex);
//     const modifiedContent = currContent.filter(content => !content.get('id') === contentId);
//     const modifiedColumns = currColumns.set(colIndex, modifiedContent);
//     const modifiedRow = currRow.set('columns', modifiedColumns);
//     return canvas.set(rowIndex, modifiedRow);
//   }
//   return canvas;
// };

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
  // removeContent: curry(removeContent)(canvas, rowId, colIndex)
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
  createStack,
  findRow,
  removeRow,
  addRow,
  reorderRows,
  addContent,
  // removeContent,
  updateRef,
  getPropsForRow
};
