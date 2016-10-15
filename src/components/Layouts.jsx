import React from 'react';
import styled from 'styled-components';
import Row from './Row.jsx';
import manifest from '../lib/manifest';

const Layouts = styled('section')`
  display: flex;
  flex-direction: column;
  padding: 10px 10px 0;
`;

export default () =>
  <Layouts>
    <Row type={manifest.ROW} col={1} />
    <Row type={manifest.ROW} col={2} />
    <Row type={manifest.ROW} col={3} />
  </Layouts>;
