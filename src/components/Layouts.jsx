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

const Note = styled.h4`
  color: #b5b5b5;
  text-align: center;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.8em;
  margin-bottom: 20px;
  width: 100%;
  letter-spacing: 0.4px;
`;

export default () =>
  <Layouts>
    <Note>Structures are your basic building blocks</Note>
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
