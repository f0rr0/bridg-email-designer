import React, { PropTypes } from 'react';
import styled from 'styled-components';
import muiThemeable from 'material-ui/styles/muiThemeable';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import Settings from 'material-ui/svg-icons/action/settings';
import Visibility from 'material-ui/svg-icons/action/visibility';
import Code from 'material-ui/svg-icons/action/code';
import Save from 'material-ui/svg-icons/content/save';
import Undo from 'material-ui/svg-icons/content/undo';
import Redo from 'material-ui/svg-icons/content/redo';
import Restore from 'material-ui/svg-icons/action/restore';
import ArrowLeft from 'material-ui/svg-icons/navigation/chevron-left';
import startCase from 'lodash.startcase';
import logo from '../assets/Bridg-TM-White.png';
import presets from '../lib/presets';

const Header = styled('header')`
  background: ${({ muiTheme }) => muiTheme.palette.canvasColor};
  display: flex;
  padding: 0.5em 0.889em;
  align-items: center;
  flex: 0 0 auto;
`;

const Logo = styled('div')`
  display: inline-block;
  vertical-align: top;
  background-image: url(${logo});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  width: 80px;
  height: 35px;
  margin: 10px 0;
  flex-grow: 0;
`;

const VerticalDivider = styled('span')`
  height: 50px;
  width: 1px;
  margin: 0 0.889em;
  background: #636363;
  flex-grow: 0;
`;

const Title = styled('div')`
  color: ${({ muiTheme }) => muiTheme.palette.textColor};
  font-size: 18px;
  flex-grow: 1;
  text-align: left;
`;

const HeaderComponent = (props) => {
  const {
    handlePreview,
    handleSave,
    handleRestore,
    handleExport,
    handleUndo,
    handleRedo,
    handlePreset,
    muiTheme
  } = props;

  const presetItems = [];
  new Map(Object.entries(presets)).forEach((preset, name) => {
    presetItems.push(
      <MenuItem
        primaryText={startCase(name)}
        onClick={handlePreset(preset)}
      />
    );
  });

  return (
    <Header muiTheme={muiTheme}>
      <a href="http://bridg.com" target="__blank"><Logo /></a>
      <VerticalDivider />
      <Title muiTheme={muiTheme}>Email Designer</Title>
      <FloatingActionButton
        style={{
          marginRight: '10px'
        }}
        mini
        secondary
        onTouchTap={handleUndo}
      >
        <Undo />
      </FloatingActionButton>
      <FloatingActionButton
        style={{
          marginRight: '30px'
        }}
        mini
        secondary
        onTouchTap={handleRedo}
      >
        <Redo />
      </FloatingActionButton>
      <IconMenu
        iconButtonElement={
          <IconButton>
            <Settings />
          </IconButton>
        }
        iconStyle={{
          color: muiTheme.palette.accent1Color
        }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          primaryText="Preview"
          leftIcon={<Visibility />}
          onClick={handlePreview}
        />
        <MenuItem
          primaryText="Export"
          leftIcon={<Code />}
          onClick={handleExport}
        />
        <Divider />
        <MenuItem
          primaryText="Save"
          leftIcon={<Save />}
          onClick={handleSave}
        />
        <MenuItem
          primaryText="Restore"
          leftIcon={<Restore />}
          onClick={handleRestore}
        />
        <Divider />
        <MenuItem
          primaryText="Presets"
          leftIcon={<ArrowLeft />}
          menuItems={presetItems}
        />
      </IconMenu>
    </Header>
  );
};

export default muiThemeable()(HeaderComponent);

HeaderComponent.propTypes = {
  handlePreview: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleRestore: PropTypes.func.isRequired,
  handleExport: PropTypes.func.isRequired,
  handleUndo: PropTypes.func.isRequired,
  handleRedo: PropTypes.func.isRequired,
  handlePreset: PropTypes.func.isRequired,
  muiTheme: PropTypes.object
};
