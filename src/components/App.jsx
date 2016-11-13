import React from 'react';
import { injectGlobal } from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Designer from './Designer';

injectTapEventPlugin();

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

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: normal;
  }

  h1 {
    font-size: 34px;
  }

  h2 {
    font-size: 30px;
  }

  h3 {
    font-size: 28px;
  }

  blockquote {
    border-left: 4px solid #696969;
    background: #cecece;
    padding: 5px;
    font-style: italic;
  }

  .text-left {
    text-align: left;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }
`;
/*eslint-enable */

export default () =>
  <MuiThemeProvider
    muiTheme={getMuiTheme(darkBaseTheme, {
      fontFamily: 'Lato',
      tabs: {
        backgroundColor: darkBaseTheme.palette.canvasColor,
        textColor: darkBaseTheme.palette.secondaryTextColor,
        selectedTextColor: darkBaseTheme.palette.textColor
      }
    })}
  >
    <Designer />
  </MuiThemeProvider>;
