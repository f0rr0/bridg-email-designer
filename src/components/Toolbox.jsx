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
            <Tab icon={<TuneIcon />} label="Tune" value={2} />
            <Tab icon={<TuneIcon />} label="Body" value={3} />
          </Tabs>
          <SwipeableViews
            index={this.state.slideIndex}
            onChangeIndex={this.handleChange}
          >
            <div>
              <Layouts />
            </div>
            <div>
              <Content />
            </div>
            <div className="customization">
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
