import React, { Component } from 'react';
import styled from 'styled-components';
import CanvasTarget from './CanvasTarget';
import parser from '../lib/parser';
import serialize from '../lib/serialize';
import * as canvasState from '../lib/canvas-state';
import Row from './Row';

const ParentContainer = styled('section')`
  order: 1;
  flex: 0 0 75%;
  max-width: 648px;
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
** <Content> -> [{ type, component} Map] List
*/

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: canvasState.create()
    };
    this.refsTree = canvasState.create();
    this.undoStack = canvasState.createStack();
    this.redoStack = canvasState.createStack();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !nextState.canvas.equals(this.state.canvas);
  }

  pushToUndoStack = () => {
    this.refsTree = this.state.canvas.mergeDeep(this.refsTree);
    const state = serialize(this.refsTree);
    this.undoStack = this.undoStack.push(state);
  }

  pushToRedoStack = () => {
    this.redoStack = this.redoStack.push(this.state.canvas);
  }

  canUndo = () => !this.undoStack.isEmpty();

  doUndo = () => {
    if (this.canUndo()) {
      this.pushToRedoStack();
      this.setState({
        canvas: canvasState.create(this.undoStack.first())
      }, () => {
        this.undoStack = this.undoStack.pop();
      });
    }
  }

  canRedo = () => !this.redoStack.isEmpty();

  doRedo = () => {
    if (this.canRedo()) {
      this.pushToUndoStack();
      this.setState({
        canvas: this.redoStack.first()
      }, () => {
        this.redoStack = this.redoStack.pop();
      });
    }
  }

  addRow = (numCols) => {
    this.pushToUndoStack();
    this.setState(({ canvas }) => ({
      canvas: canvasState.addRow(canvas, numCols)
    }));
  }

  removeRow = id => () => {
    this.pushToUndoStack();
    this.setState(({ canvas }) => ({
      canvas: canvasState.removeRow(canvas, id)
    }), () => {
      this.refsTree = canvasState.removeRow(this.refsTree, id);
    });
  }

  reorderRows = (from, to, inCanvas = true) => {
    let { canvas } = this.state;
    const toIndex = canvasState.findRow(canvas, to);
    if (inCanvas) {
      const fromIndex = canvasState.findRow(canvas, from);
      const row = canvas.get(fromIndex);
      canvas = canvas.splice(fromIndex, 1).splice(toIndex, 0, row);
      this.setState({
        canvas
      });
    }
  }

  addContent = (rowId, colIndex, content) => {
    this.pushToUndoStack();
    this.setState(({ canvas }) => ({
      canvas: canvasState.addContent(canvas, rowId, colIndex, content)
    }));
  }

  updateRef = (rowId, colIndex, components) => {
    this.refsTree = this.state.canvas.mergeDeep(this.refsTree);
    this.refsTree = canvasState.updateRef(this.refsTree, rowId, colIndex, components);
  }

  saveToLocalStorage = () => {
    this.refsTree = this.state.canvas.mergeDeep(this.refsTree);
    const state = JSON.stringify(serialize(this.refsTree));
    localStorage.setItem('canvas', state); // eslint-disable-line
  }

  loadFromLocalStorage = () => {
    const canvas = localStorage.getItem('canvas'); // eslint-disable-line
    this.setState({
      canvas: canvasState.create(JSON.parse(canvas))
    });
  }

  exportHtml = () => {
    this.refsTree = this.state.canvas.mergeDeep(this.refsTree);
    return parser(this.refsTree);
  }

  renderRows = () =>
    this.state.canvas.map((row) => {
      return (
        <Row
          {...canvasState.getPropsForRow(this.state.canvas, row)}
          inCanvas
          addContent={this.addContent}
          updateRef={this.updateRef}
          removeRow={this.removeRow}
          reorderRows={this.reorderRows}
          pushToUndoStack={this.pushToUndoStack}
        />
      );
    }).toJS();

  render() {
    return (
      <ParentContainer>
        <TargetContainer>
          <CanvasTarget
            onDrop={({ numCols }) => {
              this.addRow(numCols);
            }}
          >
            {this.renderRows()}
          </CanvasTarget>
        </TargetContainer>
      </ParentContainer>
    );
  }
}
