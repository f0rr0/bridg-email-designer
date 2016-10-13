import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const Main = styled.main`
  height: 100%;
  width: 100%;
  background: red;
`;

const Designer = () => <Main />;

export default DragDropContext(HTML5Backend)(Designer);
