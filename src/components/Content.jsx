import React from 'react';
import styled from 'styled-components';
import getComponent, { contentTypes } from '../lib/get-component';

const Content = styled('section')`
  display: flex;
  flex-direction: row;
  padding: 20px;
  flex-wrap: wrap;
`;

const Container = styled('div')`
  margin-bottom: 10px;
  width: 45%;
  height: 100px;
  margin: 2.5%;
  transition: 0.1s all cubic-bezier(0,.79,.44,.71);
    
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    box-shadow: 0 6px 10px rgba(0,0,0,.35);
  }
  
  &:active {
    transform: scale(1.05);
  }
`;

const Note = styled.h4`
  color: #b5b5b5;
  text-align: center;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.8em;
  margin-bottom: 10px;
  width: 100%;
  letter-spacing: 0.4px;
`;

export default () =>
  <Content>
    <Note> Content must be placed in a Structure.</Note>
    {
      contentTypes.map((type, index) => {
        const ComponentForType = getComponent(type);
        return (
          <Container key={index}>
            <ComponentForType type={type} readOnly />
          </Container>
        );
      })
    }
  </Content>;
