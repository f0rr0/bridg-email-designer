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

  h1 {
    font-size: 2em !important;
  }

  blockquote {
    border-left: 4px solid #696969;
    background: #cecece;
    padding: 5px;
    font-style: italic;
  }
`;
/*eslint-enable */

export default () => <Designer />;
