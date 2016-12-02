import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import muiThemeable from 'material-ui/styles/muiThemeable';
import Snackbar from 'material-ui/Snackbar';
import Header from './Header.jsx';
import Toolbox from './Toolbox.jsx';
import Canvas from './Canvas.jsx';

const Main = styled('main')`
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  font-size: 16px;
  background: #c5c5c5;
  font-family: 'Lato', sans-serif;
  display: flex;
  flex-direction: column;
`;

const Container = styled('section')`
  display: flex;
  flex: 1 1 auto;
  justify-content: space-between;
`;

const Note = styled.h4`
  color: #b5b5b5;
  text-align: center;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 0.8em;
  margin-top: 20px;
  width: 100%;
  letter-spacing: 0.4px;
`;

const DefaultCustomContent = (
  <Note>
    Select some content to display options
  </Note>
);


class Designer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      snack: false,
      message: '',
      markup: null,
      customContent: DefaultCustomContent,
      customBody: null
    };
  }

  setCustomContent = (component) => {
    if (component) {
      this.setState({
        customContent: component
      });
    } else {
      this.setState({
        customContent: DefaultCustomContent
      });
    }
  }

  setCustomBody = (component) => {
    this.setState({
      customBody: component
    });
  }


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
    textArea.value = this.exportHtml();
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

  doUndo = () => this.canvas.doUndo();

  doRedo = () => this.canvas.doRedo();

  showPreview = () => {
    const newdocument = window.open().document;
    newdocument.write(this.exportHtml());
    newdocument.close();
  }

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

  loadPreset = canvas => () => {
    try {
      this.canvas.loadFromPreset(canvas);
      this.setState({
        snack: true,
        message: 'Preset loaded successfully!'
      });
    } catch (e) {
      this.setState({
        snack: true,
        message: `Oops! ${e}`
      });
    }
  }

  render() {
    return (
      <Main>
        <Header
          handlePreview={this.showPreview}
          handleSave={this.saveState}
          handleExport={this.copyToClipboard}
          handleRestore={this.loadState}
          handlePreset={this.loadPreset}
          handleUndo={this.doUndo}
          handleRedo={this.doRedo}
        />
        <Container>
          <Toolbox
            customContent={this.state.customContent}
            customBody={this.state.customBody}
          />
          <Canvas
            ref={(c) => {
              this.canvas = c;
            }}
            setCustomContent={this.setCustomContent}
            setCustomBody={this.setCustomBody}
          />
        </Container>
        <Snackbar
          open={this.state.snack}
          message={this.state.message}
          autoHideDuration={3000}
          onRequestClose={this.toggleSnack}
          contentStyle={{
            textAlign: 'center',
            color: this.props.muiTheme.palette.textColor
          }}
          bodyStyle={{
            background: this.props.muiTheme.palette.accent2Color
          }}
        />
      </Main>
    );
  }
}

Designer.propTypes = {
  muiTheme: PropTypes.object
};

export default muiThemeable()(DragDropContext(HTML5Backend)(Designer));
