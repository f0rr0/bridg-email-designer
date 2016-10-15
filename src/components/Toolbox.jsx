import React, { Component } from 'react';
import styled from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import List from 'material-ui/svg-icons/action/list';
import Layouts from './Layouts';

injectTapEventPlugin();

const Container = styled('section')`
  width: 40%;
`;

const Slide = styled('div')`
  background: #003F60;
  color: #FFFFFF;
`;

export default class Toolbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <Container>
          <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}
            tabItemContainerStyle={{
              background: '#454F4E'
            }}
            inkBarStyle={{
              background: '#89D6FF'
            }}
          >
            <Tab icon={<Dashboard />} label="Layouts" value={0} />
            <Tab icon={<List />} label="Components" value={1} />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <Slide>
              <Layouts />
            </Slide>
            <Slide>
              Components here...
            </Slide>
          </SwipeableViews>
        </Container>
      </MuiThemeProvider>
    );
  }
}
