import React, { Component } from 'react';
import styled from 'styled-components';
import CanvasTarget from './CanvasTarget';
import manifest from '../lib/manifest';
import Row from './Row';

const Container = styled('section')`
  padding-left: 1.802em;
  display: flex;
  flex: 0 0 60%;
  max-width: 60%;
`;

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [{
        columns: [[]]
      }]
    };
  }

  handleContent = (rowIndex, columnIndex, component) => {
    const { rows } = this.state;
    rows[rowIndex].columns[columnIndex].push(component);
    this.setState({
      rows
    });
  }

  renderRows = () =>
    this.state.rows.map((row, index) =>
      <Row
        type={manifest.ROW}
        key={index}
        col={row.columns.length}
        rowIndex={index}
        handleContent={this.handleContent}
        disableDrag
      />
    );

  render() {
    return (
      <Container>
        <CanvasTarget
          onDrop={({ col }) => {
            this.setState({
              rows: this.state.rows.concat({ columns: Array(col).fill([]) })
            });
          }}
        >
          {this.renderRows()}
        </CanvasTarget>
      </Container>
    );
  }
}
