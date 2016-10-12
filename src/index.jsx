import React from 'react';
import { render } from 'react-dom';
import Test from './components/App.jsx';

const run = () => {
  render(
    <Test />,
    document.getElementById('root') // eslint-disable-line
  );
};

run();

if (module.hot) {
  module.hot.accept('./components/App.jsx', () => {
    run();
  });
}
