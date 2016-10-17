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
    {
      [...Array(4).keys()].map(
        key =>
          <Row key={key} rowIndex={key} type={manifest.ROW} col={key + 1} />
      )
    }
  </Layouts>;
