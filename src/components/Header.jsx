import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import Code from 'material-ui/svg-icons/action/code';
import Archive from 'material-ui/svg-icons/content/archive';
import Unarchive from 'material-ui/svg-icons/content/unarchive';
import logo from '../assets/Bridg-TM-White.png';

const Header = styled('header')`
  background: #303030;
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

const Divider = styled('span')`
  height: 50px;
  width: 1px;
  margin: 0 0.889em;
  background: #636363;
  flex-grow: 0;
`;

const Title = styled('div')`
  color: #FFFFFF;
  font-size: 18px;
  flex-grow: 1;
  text-align: left;
`;

export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open: !this.state.open,
      anchorEl: event.currentTarget
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false
    });
  }

  render() {
    const { handleSave, handleLoad } = this.props;
    const handleExport = () => {
      this.handleRequestClose();
      this.props.handleExport();
    };

    return (
      <Header>
        <a href="http://bridg.com" target="__blank"><Logo /></a>
        <Divider />
        <Title>Email Designer</Title>
        <IconButton
          onTouchTap={this.handleTouchTap}
        >
          <Hamburger />
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem
              primaryText="Save"
              leftIcon={<Archive />}
              onClick={handleSave}
            />
            <MenuItem
              primaryText="Load"
              leftIcon={<Unarchive />}
              onClick={handleLoad}
            />
            <MenuItem
              primaryText="Export"
              leftIcon={<Code />}
              onClick={handleExport}
            />
          </Menu>
        </Popover>
      </Header>
    );
  }
}

HeaderComponent.propTypes = {
  handleSave: PropTypes.func.isRequired,
  handleLoad: PropTypes.func.isRequired,
  handleExport: PropTypes.func.isRequired
};
