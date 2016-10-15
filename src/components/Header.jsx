import React from 'react';
import styled from 'styled-components';
import logo from '../assets/Bridg-TM-White.png';

const Header = styled('header')`
  background: #454F4E;
  display: flex;
  padding: 0.5em 0.889em;
  align-items: center;
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
`;

const Divider = styled('span')`
  height: 50px;
  width: 1px;
  margin: 0 0.889em;
  background: #636363;
`;

const Title = styled('div')`
  color: #FFFFFF;
  font-size: 18px;
`;

export default () =>
  <Header>
    <a href="http://bridg.com" target="__blank"><Logo /></a>
    <Divider />
    <Title>Email Designer</Title>
  </Header>;
