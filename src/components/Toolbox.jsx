import React, { Component } from 'react';
import styled from 'styled-components';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import ListIcon from 'material-ui/svg-icons/action/list';
import Layouts from './Layouts';
import Content from './Content';

const Container = styled('section')`
  padding-left: 1.802em;
  order: 2;
  flex: 1 0 25%;
`;

const Slide = styled('div')`
  background: rgba(137, 255, 253, 0.5);
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
      <Container>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
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
    );
  }
}
