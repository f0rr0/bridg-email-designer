import React from 'react';
import styled from 'styled-components';
import Row from './Row.jsx';

const Layouts = styled('section')`
  display: flex;
  flex-direction: column;
  padding: 10px 10px 0;
`;

export default () =>
  <Layouts>
    <Row cols={1} />
    <Row cols={2} />
    <Row cols={3} />
  </Layouts>;
