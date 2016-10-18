import React from 'react';
import styled from 'styled-components';
import capitalize from 'lodash.capitalize';
import manifest from '../lib/manifest';

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

export default () => {
  const contentTypes = Object.values(manifest).filter(type => type !== 'ROW');
  return (
    <Content>
      {
        contentTypes.map((type, index) => {
          const path = capitalize(type);
          const ComponentForType = require('./' + path).default; // eslint-disable-line
          return (
            <Container key={index}>
              <ComponentForType type={type} readOnly />
            </Container>
          );
        })
      }
    </Content>
  );
};
