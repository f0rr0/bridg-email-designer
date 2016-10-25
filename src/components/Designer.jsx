import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
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
        this.setState({
          modal: false,
          snack: true,
          message: 'Markup copied to clickboard!'
        });
      }
    } catch (e) {
      this.setState({
        modal: false,
        snack: true,
        message: `Oops! ${e}`
      });
    }
    document.body.removeChild(textArea);
    /* eslint-enable */
  };

  exportHtml = () => this.canvas.exportHtml();

  saveState = () => {
    try {
      this.canvas.saveToLocalStorage();
      this.setState({
        snack: true,
        message: 'Saved successfully!'
      });
    } catch (e) {
      this.setState({
        snack: true,
        message: `Oops! ${e}`
      });
    }
  }

  loadState = () => {
    try {
      this.canvas.loadFromLocalStorage();
      this.setState({
        snack: true,
        message: 'Restored from memory successfully!'
      });
    } catch (e) {
      this.setState({
        snack: true,
        message: `Oops! ${e}`
      });
    }
  }

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
        <Header
          handleSave={this.saveState}
          handleExport={this.toggleModal}
          handleLoad={this.loadState}
        />
        <Container>
          <Toolbox />
          <Canvas ref={(c) => { this.canvas = c; }} />
        </Container>
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
      </Main>
    );
  }
}

export default DragDropContext(HTML5Backend)(Designer);
