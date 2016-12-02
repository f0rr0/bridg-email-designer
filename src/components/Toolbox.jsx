import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import ListIcon from 'material-ui/svg-icons/action/list';
import TuneIcon from 'material-ui/svg-icons/image/tune';
import BodyIcon from 'material-ui/svg-icons/av/web-asset';
import Layouts from './Layouts';
import Content from './Content';

const Container = styled('section')`
  padding-left: 15px;
  width: 100%;
  max-width: 500px;
  min-width: 394px;
  order: 2;
  display: flex;
  flex-direction: column;
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
        <Paper
          style={{
            width: '100%',
            background: '#f4f4f4',
            height: '100%',
            borderRadius: 0
          }}
        >
          <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}
            tabTemplateStyle={{
              background: '#eee'
            }}
            inkBarStyle={{
              background: '#555'
            }}
          >
            <Tab icon={<DashboardIcon />} label="Structure" value={0} disableTouchRipple />
            <Tab icon={<ListIcon />} label="Content" value={1} disableTouchRipple />
            <Tab icon={<TuneIcon />} label="Properties" value={2} disableTouchRipple />
            <Tab icon={<BodyIcon />} label="Body" value={3} disableTouchRipple />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
            className="customization"
            style={{
            }}
          >
            <div>
              <Layouts />
            </div>
            <div>
              <Content />
            </div>
            <div>
              {this.props.customContent}
            </div>
            <div>
              {this.props.customBody}
            </div>
          </SwipeableViews>
        </Paper>
      </Container>
    );
  }
}

Toolbox.propTypes = {
  customContent: PropTypes.object,
  customBody: PropTypes.object
};
