import React from 'react';
import styled from 'styled-components';
import uniqueid from 'lodash.uniqueid';
import Row from './Row.jsx';
import manifest from '../lib/manifest';

const Layouts = styled('section')`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export default () =>
  <Layouts>
    {
      [...Array(4).keys()].map(
        (key) => {
          const id = uniqueid();
          return (
            <Row
              key={id}
              id={id}
              type={manifest.ROW}
              numCols={key + 1}
            />
          );
        }
      )
    }
  </Layouts>;
