import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import uniqueid from 'lodash.uniqueid';
import CanvasTarget from './CanvasTarget';
import manifest from '../lib/manifest';
import parser from '../lib/parser';
import Row from './Row';

const ParentContainer = styled('section')`
  padding-left: 1.802em;
  flex: 0 0 75%;
  max-width: 75%;
`;

const TargetContainer = styled('section')`
  background: rgba(115, 75, 109, 0.5);
  width: 100%;
  height: 100%;
  display: flex;
`;

/* Canvas state is a Immutable Data Structure which holds refs to content.
** Canvas -> [<Row>] List
** <Row> -> { id, columns<Column> } Map
** <Column> -> [<Content>] List
** <Content> -> [refs] List
*/

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    const { rows = 0, cols = 0 } = props;
    this.state = {
      canvas: fromJS(Array(rows).fill().map(() => ({
        id: uniqueid(),
        columns: Array(cols).fill(Array(0))
      })))
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.canvas === this.state.canvas) {
      return false;
    }
    return true;
  }

  addRow = (cols) => {
    const newRow = {
      id: uniqueid(),
      columns: Array(cols).fill(Array(0))
    };
    this.setState({
      canvas: this.state.canvas.push(fromJS(newRow))
    });
  }

  findRow = (id) => {
    let found = -1;
    this.state.canvas.filter((row, index) => {
      if (row && row.get('id') === id) {
        found = index;
        return true;
      }
      return false;
    });
    return found;
  }

  removeRow = id => () => {
    const index = this.findRow(id);
    if (index >= 0) {
      this.setState({
        canvas: this.state.canvas.delete(index)
      });
    }
  }

  reorderRows = (from, to, inCanvas = true) => {
    let { canvas } = this.state;
    const toIndex = this.findRow(to);
    if (inCanvas) {
      const fromIndex = this.findRow(from);
      const row = canvas.get(fromIndex);
      canvas = canvas.splice(fromIndex, 1);
      canvas = canvas.splice(toIndex, 0, row);
      this.setState({
        canvas
      });
    }
  }

  handleContent = (id, col, content) => {
    const { canvas } = this.state;
    const row = this.findRow(id);
    if (row >= 0) {
      const currRow = canvas.get(row);
      const currColumns = currRow.get('columns');
      const currContent = currColumns.get(col);
      const modifiedContent = currContent.push(content);
      const modifiedColumns = currColumns.set(col, modifiedContent);
      const modifiedRow = currRow.set('columns', modifiedColumns);
      this.setState({
        canvas: this.state.canvas.set(row, modifiedRow)
      });
    }
  }

  exportHtml = () => parser(this.state.canvas);

  renderRows = () =>
    this.state.canvas.map(row =>
      <Row
        type={manifest.ROW}
        key={row.get('id')}
        col={row.get('columns').size}
        id={row.get('id')}
        findRow={this.findRow}
        handleContent={this.handleContent}
        inCanvas
        reorderRows={this.reorderRows}
        onClick={this.removeRow(row.get('id'))}
      />).toJS();

  render() {
    return (
      <ParentContainer>
        <TargetContainer>
          <CanvasTarget
            onDrop={({ col }) => {
              this.addRow(col);
            }}
          >
            {this.renderRows()}
          </CanvasTarget>
        </TargetContainer>
      </ParentContainer>
    );
  }
}

Canvas.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number
};
