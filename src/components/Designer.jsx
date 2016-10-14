import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Header from './Header.jsx';
import Toolbox from './Toolbox.jsx';

const Main = styled('main')`
  height: 100%;
  width: 100%;
  font-size: 18px;
  background: #FFFFFF;
  font-family: 'Lato', sans-serif;
`;

const Container = styled('section')`
  padding: 1.802em 1.802em 0;
  display: flex;
  align-items: stretch;
`;

class Designer extends Component {
  render() {
    return (
      <Main>
        <Header />
        <Container>
          <Toolbox />
        </Container>
      </Main>
    );
  }
}

export default DragDropContext(HTML5Backend)(Designer);
