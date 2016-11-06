import React from 'react';
import styled from 'styled-components';
import getComponent, { contentTypes } from '../lib/get-component';

const Content = styled('section')`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Container = styled('div')`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default () =>
  <Content>
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
