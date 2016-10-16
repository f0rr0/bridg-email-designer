import React, { PropTypes } from 'react';
import styled, { css } from 'styled-components';
import Text from './Text';

const Container = styled('div')`
  background: #454F4E;
  max-width: ${({ col }) => css`${100 / col}%`}
  flex: ${({ col }) => css`0 0 ${100 / col}%`}
  padding: 5px 0 5px 5px;
  border-radius: 3px;

  &:last-child {
    padding-right: 5px;
  }
`;

const Column = props =>
  <Container col={props.col} >
    <Text {...props} />
  </Container>;

Column.propTypes = {
  col: PropTypes.number.isRequired
};

export default Column;
