import React, { PropTypes } from 'react';
import styled from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import Code from 'material-ui/svg-icons/action/code';
import logo from '../assets/Bridg-TM-White.png';


const Header = styled('header')`
  background: #454F4E;
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

export default function HeaderComponent(props) {
  return (
    <Header>
      <a href="http://bridg.com" target="__blank"><Logo /></a>
      <Divider />
      <Title>Email Designer</Title>
      <MuiThemeProvider>
        <RaisedButton
          label="Export Markup"
          secondary
          icon={<Code />}
          onClick={props.onClick}
        />
      </MuiThemeProvider>
    </Header>
  );
}

HeaderComponent.propTypes = {
  onClick: PropTypes.func.isRequired
};
