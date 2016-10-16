import React, { Component, PropTypes } from 'react';
import styled, { css } from 'styled-components';
import ColumnTarget from './ColumnTarget';
import manifest from '../lib/manifest';
import Text from './Text';

const Container = styled('div')`
  background: #636363;
  max-width: ${({ col }) => css`${100 / col}%`}
  flex: ${({ col }) => css`0 0 ${100 / col}%`}
  border-right: 5px solid #454F4E;

  &:last-child {
    border-right: none;
  }
`;

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: []
    };
  }

  renderContent() {
    return this.state.content.map((type, index) =>
      <Text
        type={manifest.TEXT}
        key={index}
        disableDrag
      />
    );
  }

  render() {
    return (
      <Container col={this.props.col}>
        <ColumnTarget
          onDrop={({ type }) => {
            this.setState({ content: this.state.content.concat(type) });
          }}
        >
          {this.renderContent()}
        </ColumnTarget>
      </Container>
    );
  }
}

Column.propTypes = {
  col: PropTypes.number.isRequired
};

export default Column;
