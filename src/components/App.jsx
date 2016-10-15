import React from 'react';
import { injectGlobal } from 'styled-components';
import Designer from './Designer';

/*eslint-disable */
injectGlobal`
  * {
    margin: 0;
    padding: 0;
    border: none;
    box-sizing: border-box;
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  article,
  aside,
  footer,
  header,
  hgroup,
  nav,
  section,
  time {
    display: block;
  }
`;
/*eslint-enable */

export default () => <Designer />;
