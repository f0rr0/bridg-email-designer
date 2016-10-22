import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Dialog from 'material-ui/Dialog';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';
import Header from './Header.jsx';
import Toolbox from './Toolbox.jsx';
import Canvas from './Canvas.jsx';

const Main = styled('main')`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 16px;
  background: linear-gradient(to top, #141E30 , #243B55);
  font-family: 'Lato', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Container = styled('section')`
  padding: 1.802em;
  display: flex;
  flex: 1 1 auto;
  justify-content: space-between;
`;

class Designer extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.state = {
      modal: false,
      snack: false,
      message: '',
      markup: null
    };
  }

  toggleModal = () => this.setState({
    modal: !this.state.modal,
    markup: this.exportHtml()
  });

  toggleSnack = () => this.setState({
    snack: !this.state.snack
  });

  copyToClipboard = () => {
    /* eslint-disable */
    const textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = this.state.markup;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      if (document.execCommand('copy')) {
        console.log(document.execCommand('copy'));
        this.setState({
          modal: false,
          snack: true,
          message: 'Markup copied to clickboard!'
        });
      }
    } catch (err) {
      this.setState({
        modal: false,
        snack: true,
        message: `Oops! ${err}`
      });
    }
    document.body.removeChild(textArea);
    /* eslint-enable */
  };

  exportHtml = () => this.canvas.exportHtml();

  render() {
    const actions = [
      <FlatButton
        label="Close"
        onTouchTap={this.toggleModal}
      />,
      <FlatButton
        label="Copy to Clipboard"
        secondary
        onTouchTap={this.copyToClipboard}
      />,
    ];
    const html = this.state.markup;
    return (
      <Main>
        <Header onClick={this.toggleModal} />
        <Container>
          <Toolbox />
          <Canvas ref={(c) => { this.canvas = c; }} />
        </Container>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div>
            <Dialog
              title="Preview"
              actions={actions}
              modal={false}
              open={this.state.modal}
              onRequestClose={this.toggleModal}
              autoScrollBodyContent
            >
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </Dialog>
            <Snackbar
              open={this.state.snack}
              message={this.state.message}
              autoHideDuration={3000}
              onRequestClose={this.toggleSnack}
              contentStyle={{
                textAlign: 'center'
              }}
            />
          </div>
        </MuiThemeProvider>
      </Main>
    );
  }
}

export default DragDropContext(HTML5Backend)(Designer);
