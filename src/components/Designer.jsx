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
  background: linear-gradient(to top, #141E30 , #243B55);
  font-family: 'Lato', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Container = styled('section')`
  padding: 1.802em;
  display: flex;
  flex: 1 1 auto;
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
