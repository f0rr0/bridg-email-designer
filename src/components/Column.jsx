import React, { Component, PropTypes } from 'react';
import equal from 'deep-equal';
import styled, { css } from 'styled-components';
import capitalize from 'lodash.capitalize';
import ColumnTarget from './ColumnTarget';

const Container = styled('div')`
  background: #636363;
  max-width: ${({ col }) => css`${100 / col}%`}
  flex: ${({ col }) => css`0 0 ${100 / col}%`}
  border-right: 5px solid #454F4E;

  &:last-child {
    border-right: none;
  }
`;

export default class Column extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: []
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || !equal(this.state, nextState);
  }

  renderContent() {
    return this.state.content.map((content, index) => {
      const path = capitalize(content.type);
      const Content = require('./' + path).default; // eslint-disable-line
      return (
        <Content
          type={content.type}
          key={index}
          inCanvas
          disableDrag
        />
      );
    }
    );
  }

  render() {
    const { col, handleContent, rowIndex, columnIndex } = this.props;
    return (
      <Container col={col}>
        <ColumnTarget
          onDrop={({ type, component }) => {
            this.setState({
              content: this.state.content.concat({
                type,
                component
              })
            });
            handleContent(rowIndex, columnIndex, component);
          }}
        >
          {this.renderContent()}
        </ColumnTarget>
      </Container>
    );
  }
}

Column.propTypes = {
  col: PropTypes.number.isRequired,
  handleContent: PropTypes.func,
  rowIndex: PropTypes.number.isRequired,
  columnIndex: PropTypes.number.isRequired
};
