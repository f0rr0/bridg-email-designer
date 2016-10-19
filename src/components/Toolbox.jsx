import React, { Component } from 'react';
import styled from 'styled-components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import injectTapEventPlugin from 'react-tap-event-plugin';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import ListIcon from 'material-ui/svg-icons/action/list';
import Layouts from './Layouts';
import Content from './Content';

injectTapEventPlugin();

const Container = styled('section')`
  flex: 0 0 25%;
  max-width: 25%;
`;

const Slide = styled('div')`
  background: rgba(137, 255, 253, 0.5);
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
            <Tab icon={<DashboardIcon />} label="Layouts" value={0} />
            <Tab icon={<ListIcon />} label="Content" value={1} />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <Slide>
              <Layouts />
            </Slide>
            <Slide>
              <Content />
            </Slide>
          </SwipeableViews>
        </Container>
      </MuiThemeProvider>
    );
  }
}
