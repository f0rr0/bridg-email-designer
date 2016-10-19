import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import FlipMove from 'react-flip-move';
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

// Canvas state is a 3D Immutable List which holds refs to content

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    const { rows = 0, cols = 0 } = props;
    this.state = {
      canvas: fromJS(Array(rows).fill().map(() => Array(cols).fill(Array(0))))
    };
  }

  componentDidMount() {
    // const inky = require('inky/dist/inky-browser');
    // console.log(inky);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.canvas === this.state.canvas) {
      return false;
    }
    return true;
  }

  addRow = (cols) => {
    this.setState({
      canvas: this.state.canvas.push(fromJS(Array(cols).fill(Array(0))))
    });
  }

  removeRow = index => () => {
    this.setState({
      canvas: this.state.canvas.set(index, null)
    });
  }

  handleContent = (row, col, content) => {
    const newContent = this.state.canvas.getIn([row, col]).push(content);
    this.setState({
      canvas: this.state.canvas.setIn([row, col], newContent)
    }, () => {
      console.log(this.exportHtml());
    });
  }

  exportHtml = () => parser(this.state.canvas);

  renderRows = () =>
    this.state.canvas.map((row, index) => {
      if (row) {
        return (
          <Row
            type={manifest.ROW}
            key={index}
            col={row.size}
            rowIndex={index}
            handleContent={this.handleContent}
            disableDrag
            inCanvas
            onClick={this.removeRow(index)}
          />
        );
      }
      return null;
    }).toJS();

  render() {
    return (
      <ParentContainer>
        <TargetContainer>
          <CanvasTarget
            onDrop={({ col }) => {
              this.addRow(col);
            }}
          >
            <FlipMove
              typeName="div"
              enterAnimation="accordianVertical"
              leaveAnimation="accordianVertical"
              easing="ease-in-out"
              duration="200"
              staggerDurationBy="15"
              staggerDelayBy="20"
            >
              {this.renderRows()}
            </FlipMove>
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
