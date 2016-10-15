import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Header from './Header.jsx';
import Toolbox from './Toolbox.jsx';
import Canvas from './Canvas.jsx';

const Main = styled('main')`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 16px;
  background: #0FBD72;
  font-family: 'Lato', sans-serif;
`;

const Container = styled('section')`
  padding: 1.802em 1.802em;
  display: flex;
  height: 85%;
`;

class Designer extends Component {
  render() {
    return (
      <Main>
        <Header />
        <Container>
          <Toolbox />
          <Canvas />
        </Container>
      </Main>
    );
  }
}

export default DragDropContext(HTML5Backend)(Designer);
