import React, { Component, PropTypes } from 'react';
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
    this.components = [];
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.content.length !== nextState.content.length;
  }

  componentDidUpdate() {
    const { handleContent, rowId, columnIndex } = this.props;
    const newComponent = this.components[this.components.length - 1];
    handleContent(rowId, columnIndex, newComponent);
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
          ref={(c) => {
            if (c) {
              this.components[index] = c.decoratedComponentInstance;
            }
          }}
        />
      );
    });
  }

  render() {
    const { col } = this.props;
    return (
      <Container col={col}>
        <ColumnTarget
          onDrop={({ type }) => {
            this.setState({
              content: this.state.content.concat({
                type
              })
            });
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
  rowId: PropTypes.string.isRequired,
  columnIndex: PropTypes.number.isRequired
};
