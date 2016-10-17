import React from 'react';
import styled from 'styled-components';
import Text from './Text';
import manifest from '../lib/manifest';

const Content = styled('section')`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

export default () =>
  <Content>
    <Text type={manifest.TEXT} readOnly />
  </Content>;
