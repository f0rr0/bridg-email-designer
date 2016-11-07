import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import ListIcon from 'material-ui/svg-icons/action/list';
import TuneIcon from 'material-ui/svg-icons/image/tune';
import Layouts from './Layouts';
import Content from './Content';

const Container = styled('section')`
  padding-left: 15px;
  width: 394px;
  max-width: 394px;
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
            height: 'auto',
            width: '100%',
            background: 'rgba(0, 0, 0, 0.35)'
          }}
        >
          <Tabs
            onChange={this.handleChange}
            value={this.state.slideIndex}
          >
            <Tab icon={<DashboardIcon />} label="Layouts" value={0} />
            <Tab icon={<ListIcon />} label="Content" value={1} />
            <Tab icon={<TuneIcon />} label="Customization" value={2} />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
            style={{
              height: '100%'
            }}
          >
            <div>
              <Layouts />
            </div>
            <div>
              <Content />
            </div>
            <div>
              {this.props.custom}
            </div>
          </SwipeableViews>
        </Paper>
      </Container>
    );
  }
}

Toolbox.propTypes = {
  custom: PropTypes.object
};
