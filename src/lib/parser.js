// canvas is a 3D Immutable Map
// import Inky from 'inky/dist/inky-browser.js';
import { load } from 'cheerio';

const parseColumn = (column) => {
  let markup = '';
  column.forEach((content) => {
    markup += content.export();
  });
  return markup;
};

const parseRow = (row, numCols) => {
  const colSize = 12 / numCols;
  let markup = '';
  row.forEach((column) => {
    markup += `<columns small="12" large="${colSize}">${parseColumn(column)}</columns>`;
  });
  return markup;
};

const parseCanvas = (canvas, collapse) => {
  let markup = '';
  canvas.forEach((row) => {
    if (row) {
      const numCols = row.size;
      markup += `<row ${collapse ? 'class="collapse"' : ''}>${parseRow(row, numCols)}</row>`;
    }
  });
  return markup;
};

const exportMarkup = (canvas, collapse = false, options = {}) => {
  const markup = `<container>${parseCanvas(canvas, collapse)}</container>`;
  return load(markup).html();
};

export { parseColumn, parseRow, parseCanvas };

export default exportMarkup;
