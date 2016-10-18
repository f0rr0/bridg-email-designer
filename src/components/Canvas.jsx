import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { fromJS } from 'immutable';
import CanvasTarget from './CanvasTarget';
import manifest from '../lib/manifest';
import Row from './Row';

const Container = styled('section')`
  padding-left: 1.802em;
  display: flex;
  flex: 0 0 75%;
  max-width: 75%;
`;

// Canvas state is a 3D Immutable List which holds refs to content

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    const { rows = 1, cols = 1 } = props;
    this.state = {
      canvas: fromJS(Array(rows).fill().map(() => Array(cols).fill(Array(0))))
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.canvas.size === this.state.canvas.size) {
      return false;
    }
    return true;
  }

  addRow = (cols) => {
    this.setState({
      canvas: this.state.canvas.push(fromJS(Array(cols).fill(Array(0))))
    });
  }

  handleContent = (row, col, content) => {
    console.log(this.exportHtml());
    const newContent = this.state.canvas.getIn([row, col]).push(content);
    this.setState({
      canvas: this.state.canvas.setIn([row, col], newContent)
    });
  }

  exportHtml = () => {
    let html = '';
    this.state.canvas.forEach((row) => {
      row.forEach((column) => {
        column.forEach((content) => {
          if (content) {
            html += content.export();
          }
        });
      });
    });
    return html;
  }

  renderRows = () =>
    this.state.canvas.map((row, index) =>
      <Row
        type={manifest.ROW}
        key={index}
        col={row.size}
        rowIndex={index}
        handleContent={this.handleContent}
        disableDrag
      />).toJS();

  render() {
    return (
      <Container>
        <CanvasTarget
          onDrop={({ col }) => {
            this.addRow(col);
          }}
        >
          {this.renderRows()}
        </CanvasTarget>
      </Container>
    );
  }
}

Canvas.propTypes = {
  rows: PropTypes.number,
  cols: PropTypes.number
};
