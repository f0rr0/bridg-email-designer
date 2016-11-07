import React, { Component, PropTypes } from 'react';
import styled, { css } from 'styled-components';
import equal from 'deep-equal';
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color';
import ImageIcon from 'material-ui/svg-icons/image/image';
import Paper from 'material-ui/Paper';
import uniqueid from 'lodash.uniqueid';
import DialogInput from './DialogInput';
import DropDown from './DropDown';
import PlusMinus from './PlusMinus';
import ColorPicker from './ColorPicker';
import CanvasTarget from './CanvasTarget';
import exportToHTML from '../lib/export';
import serialize from '../lib/serialize';
import * as canvasState from '../lib/canvas-state';
import Row from './Row';

const ParentContainer = styled(Paper)`
  order: 1;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 500px;
  max-width: 840px;
`;

const TargetContainer = styled('section')`
  color: #000000;
  background-image: ${({ backgroundImage }) => css`url(${backgroundImage})`}
  background-size: cover;
  background-color: ${({ backgroundColor }) => backgroundColor}
  border: ${({ borderSize, borderStyle, borderColor }) => `${borderSize}px ${borderStyle} ${borderColor}`}
  width: 100%;
  height: 100%;
  display: flex;
`;

const Control = styled('div')`
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

/* Canvas state is an Immutable Data Structure which holds refs to content.
** Canvas -> [<Row>] List
** <Row> -> { id, columns<Column> } Map
** <Column> -> [<Content>] List
** <Content> -> [{ type, component} Map] List
*/

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: canvasState.create(),
      backgroundImage: '',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(0, 0, 0, 1)',
      borderSize: 0,
      borderStyle: 'solid',
    };
    this.uniqueid = uniqueid();
    this.refsTree = canvasState.create();
    this.undoStack = canvasState.createStack();
    this.redoStack = canvasState.createStack();
  }

  componentDidMount() {
    this.props.setCustom(this.getCustom());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.state, nextState);
  }

  componentDidUpdate() {
    this.uniqueid = uniqueid();
    this.props.setCustom(this.getCustom());
  }

  onDrop = ({ numCols }) => {
    this.addRow(numCols);
  }

  getCustom = () =>
    <div style={{ padding: 10 }} key={this.uniqueid}>
      <Control>
        <DialogInput
          icon={<ImageIcon />}
          label="Background Image"
          floatingLabelText="Enter link to image"
          initialValue={this.state.backgroundImage === '' ? 'https://unsplash.it/640/1000/?random' : this.state.backgroundImage}
          onChange={this.customDispatch('backgroundImage')}
        />
      </Control>
      <Control>
        <ColorPicker
          label="Background Color"
          initialValue={this.state.backgroundColor}
          onChange={this.customDispatch('backgroundColor')}
        />
      </Control>
      <Control>
        <ColorPicker
          label="Border Color"
          icon={BorderColorIcon}
          initialValue={this.state.borderColor}
          onChange={this.customDispatch('borderColor')}
        />
      </Control>
      <Control>
        <PlusMinus
          label="Border"
          initialValue={this.state.borderSize}
          onChange={this.customDispatch('borderSize')}
        />
      </Control>
      <Control>
        <DropDown
          initialValue={this.state.borderStyle}
          label="Border Style"
          onChange={this.customDispatch('borderStyle')}
          items={[
            {
              value: 'solid',
              primaryText: 'Solid'
            },
            {
              value: 'dotted',
              primaryText: 'Dotted'
            },
            {
              value: 'dashed',
              primaryText: 'Dashed'
            },
            {
              value: 'double',
              primaryText: 'Double'
            }
          ]}
        />
      </Control>
    </div>;

  customDispatch = type => (val) => {
    switch (type) {
      case 'backgroundImage':
        this.pushToUndoStack();
        this.setState({
          backgroundImage: val
        });
        break;
      case 'backgroundColor':
        this.pushToUndoStack();
        this.setState({
          backgroundColor: val
        });
        break;
      case 'borderColor':
        this.pushToUndoStack();
        this.setState({
          borderColor: val
        });
        break;
      case 'borderSize':
        this.pushToUndoStack();
        this.setState({
          borderSize: val
        });
        break;
      case 'borderStyle':
        this.pushToUndoStack();
        this.setState({
          borderStyle: val
        });
        break;
      default:
    }
  }

  canUndo = () => !this.undoStack.isEmpty();

  doUndo = () => {
    if (this.canUndo()) {
      const canvas = serialize(this.refsTree).toJSON();
      const state = Object.assign({}, this.state, {
        canvas
      });
      this.redoStack = this.redoStack.push(state);
      this.refsTree = canvasState.create(this.undoStack.first().canvas);
      this.setState({
        ...this.undoStack.first(),
        canvas: this.refsTree
      }, () => {
        this.undoStack = this.undoStack.pop();
      });
    }
  }

  canRedo = () => !this.redoStack.isEmpty();

  doRedo = () => {
    if (this.canRedo()) {
      const canvas = serialize(this.refsTree).toJSON();
      const state = Object.assign({}, this.state, {
        canvas
      });
      this.undoStack = this.undoStack.push(state);
      this.refsTree = canvasState.create(this.redoStack.first().canvas);
      this.setState({
        ...this.redoStack.first(),
        canvas: this.refsTree
      }, () => {
        this.redoStack = this.redoStack.pop();
      });
    }
  }

  addRow = (numCols) => {
    this.pushToUndoStack();
    this.setState(({ canvas }) => ({
      canvas: canvasState.addRow(canvas, numCols)
    }), () => {
      this.refsTree = this.state.canvas.mergeDeep(this.refsTree);
    });
  }

  pushToUndoStack = () => {
    const canvas = serialize(this.refsTree).toJSON();
    const state = Object.assign({}, this.state, {
      canvas
    });
    this.undoStack = this.undoStack.push(state);
    this.redoStack = this.redoStack.clear();
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
    this.refsTree = canvasState.updateRef(this.refsTree, rowId, colIndex, components);
  }

  saveToLocalStorage = () => {
    const state = JSON.stringify({
      ...this.state,
      canvas: serialize(this.refsTree)
    });
    localStorage.setItem('canvas', state); // eslint-disable-line
  }

  loadFromLocalStorage = () => {
    const state = JSON.parse(localStorage.getItem('canvas')); // eslint-disable-line
    this.refsTree = canvasState.create(state.canvas);
    this.redoStack = this.redoStack.clear();
    this.undoStack = this.undoStack.clear();
    this.setState({
      ...state,
      canvas: this.refsTree
    });
  }

  exportHtml = () => exportToHTML(this.refsTree, this.state);

  renderRows = () =>
    this.state.canvas.map(row =>
      <Row
        {...canvasState.getPropsForRow(this.state.canvas, row)}
        inCanvas
        addContent={this.addContent}
        updateRef={this.updateRef}
        removeRow={this.removeRow}
        reorderRows={this.reorderRows}
        pushToUndoStack={this.pushToUndoStack}
        setCustom={this.props.setCustom}
      />
    ).toJS();

  render() {
    const {
      backgroundColor,
      backgroundImage,
      borderSize,
      borderStyle,
      borderColor
    } = this.state;
    return (
      <ParentContainer
        onClick={() => this.props.setCustom(this.getCustom())}
      >
        <TargetContainer
          backgroundColor={backgroundColor}
          backgroundImage={backgroundImage}
          borderSize={borderSize}
          borderStyle={borderStyle}
          borderColor={borderColor}
        >
          <CanvasTarget onDrop={this.onDrop}>
            {this.renderRows()}
          </CanvasTarget>
        </TargetContainer>
      </ParentContainer>
    );
  }
}

Canvas.propTypes = {
  setCustom: PropTypes.func.isRequired
};
