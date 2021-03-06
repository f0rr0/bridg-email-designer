import React, { Component, PropTypes } from 'react';
import styled, { css } from 'styled-components';
import equal from 'deep-equal';
import BorderColorIcon from 'material-ui/svg-icons/editor/border-color';
import ImageIcon from 'material-ui/svg-icons/image/image';
import Paper from 'material-ui/Paper';
import uniqueid from 'lodash.uniqueid';
import SwitchInput from './SwitchInput';
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
  display: flex;
  min-width: 584px;
  max-width: 100%;
  margin: 15px 0 0 15px;
`;

const TargetContainer = styled('section')`
  color: #000000;
  background-image: ${({ backgroundImage, useBackgroundImage }) => useBackgroundImage ? css`url(${backgroundImage})` : 'none'}
  background-size: cover;
  background-color: ${({ backgroundColor }) => backgroundColor}
  border: ${({ borderSize, borderStyle, borderColor }) => `${borderSize}px ${borderStyle} ${borderColor}`}
  flex: 1 1 100%;
  display: flex;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: normal;
  line-height: 1.3;
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
      useBackgroundImage: false,
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
    this.props.setCustomBody(this.getCustom());
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.state, nextState);
  }

  componentDidUpdate() {
    this.props.setCustomBody(this.getCustom());
  }

  onDrop = ({ numCols }) => {
    this.addRow(numCols);
  }

  getCustom = () =>
    <div style={{ padding: 20 }} key={this.uniqueid}>
      <Control>
        <SwitchInput
          label="Use Background Image"
          initialValue={this.state.useBackgroundImage}
          onChange={this.customDispatch('useBackgroundImage')}
        />
      </Control>
      <Control>
        <DialogInput
          icon={<ImageIcon />}
          disabled={!this.state.useBackgroundImage}
          label="Background Image"
          floatingLabelText="Enter link to image"
          initialValue={this.state.backgroundImage === '' ? 'https://unsplash.it/840/1000/?random' : this.state.backgroundImage}
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
      case 'useBackgroundImage':
        this.pushToUndoStack();
        this.setState({
          useBackgroundImage: val
        });
        break;
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
        this.uniqueid = uniqueid();
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
        this.uniqueid = uniqueid();
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

  reorderRows = (from, position, to, inCanvas = true) => {
    if (canvasState.shouldReorderRows(this.state.canvas, from, position, to, inCanvas)) {
      /* this.pushToUndoStack(); */
      this.setState(({ canvas }) => ({
        canvas: canvasState.reorderRows(canvas, from, to)
      }), () => {
        this.refsTree = canvasState.reorderRows(this.refsTree, from, to);
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
    localStorage.setItem('canvas', state);
  }

  loadFromLocalStorage = () => {
    const state = JSON.parse(localStorage.getItem('canvas'));
    this.refsTree = canvasState.create(state.canvas);
    this.redoStack = this.redoStack.clear();
    this.undoStack = this.undoStack.clear();
    this.uniqueid = uniqueid();
    this.setState({
      ...state,
      canvas: this.refsTree
    });
  }

  loadFromPreset = (preset) => {
    this.pushToUndoStack();
    this.refsTree = canvasState.create(preset.canvas);
    this.uniqueid = uniqueid();
    this.setState({
      ...preset,
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
        addRow={this.addRow}
        removeRow={this.removeRow}
        reorderRows={this.reorderRows}
        pushToUndoStack={this.pushToUndoStack}
        setCustom={this.props.setCustomContent}
      />
    ).toJS();

  render() {
    const {
      backgroundColor,
      useBackgroundImage,
      backgroundImage,
      borderSize,
      borderStyle,
      borderColor
    } = this.state;
    return (
      <ParentContainer>
        <TargetContainer
          backgroundColor={backgroundColor}
          useBackgroundImage={useBackgroundImage}
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
  setCustomContent: PropTypes.func.isRequired,
  setCustomBody: PropTypes.func.isRequired
};
