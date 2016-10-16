import React, { Component } from 'react';
import styled from 'styled-components';
import CanvasTarget from './CanvasTarget';
import manifest from '../lib/manifest';
import Row from './Row';

const Container = styled('section')`
  margin-left: 1.802em;
  width: 60%;
  background: #003F60;
  display: flex;
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
      <Row type={manifest.ROW} key={index} disableDrag col={col} />
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
