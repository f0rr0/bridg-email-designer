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
      rows: [2]
    };
  }

  renderRows() {
    return this.state.rows.map((col, index) =>
      <Row
        type={manifest.ROW}
        key={index} col={col}
        disableDrag
      />
    );
  }

  render() {
    return (
      <Container>
        <CanvasTarget
          onDrop={({ col }) => {
            this.setState({ rows: this.state.rows.concat(col) });
          }}
        >
          {this.renderRows()}
        </CanvasTarget>
      </Container>
    );
  }
}
