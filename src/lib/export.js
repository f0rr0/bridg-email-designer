import juice from 'juice/client';
import css from '!raw!../css/foundation-emails.css'; // eslint-disable-line

const parseColumn = (column) => {
  let markup = '';
  column.forEach((content) => {
    markup += content.get('component').export();
  });
  return markup;
};

const parseRow = (row) => {
  let markup = '';
  if (row) {
    const columns = row.get('columns');
    const numCols = columns.size;
    const colSize = 12 / numCols;
    columns.forEach((column, index) => {
      let classString = `"small-12 large-${colSize}`;
      if (numCols > 1 && index === 0) {
        classString += ' first columns"';
      } else if (numCols > 1 && index === numCols - 1) {
        classString += ' last columns"';
      } else if (numCols === 1) {
        classString += ' first last columns"';
      } else {
        classString += ' columns"';
      }
      markup += `<th class=${classString}>${parseColumn(column)}</columns>`;
    });
  }
  return markup;
};

const parseCanvas = (canvas) => {
  let markup = '';
  canvas.forEach((row) => {
    markup += `<table class="row"><tr>${parseRow(row)}</tr></table>`;
  });
  return markup;
};

const withTemplate = (markup, styles) =>
  `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width"/>
  <style>
    ${styles}
  </style>
</head>
<body>
  <table class="body" data-made-with-foundation>
    <tr>
      <td class="float-center" align="center" valign="top">
        <center>
          ${markup}
        </center>
      </td>
    </tr>
  </table>
</body>
</html>`;

const exportMarkup = (canvas, state) => {
  const {
    backgroundColor,
    backgroundImage,
    useBackgroundImage,
    borderSize,
    borderStyle,
    borderColor
  } = state;
  const markup = `<table class="container" style="color: #000000; border: ${borderSize}px ${borderStyle} ${borderColor}; background-color: ${backgroundColor}; background-image: ${useBackgroundImage ? `url(${backgroundImage})` : 'none'}; background-size: cover;"><tr><td>${parseCanvas(canvas)}</td></tr></table>`;
  return juice(withTemplate(markup, css));
};

export default exportMarkup;
