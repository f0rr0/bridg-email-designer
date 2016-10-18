import React, { Component, PropTypes } from 'react';
import equal from 'deep-equal';
import { DropTarget } from 'react-dnd';
import { target } from '../lib/generic-drop-target';
import manifest from '../lib/manifest';

const contentTypes = Object.values(manifest).filter(type => type !== 'ROW');

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

class ColumnTarget extends Component {
  shouldComponentUpdate(nextProps) {
    return !equal(this.props, nextProps);
  }

  render() {
    const { connectDropTarget, isOver, children } = this.props;
    return connectDropTarget(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: isOver ? '#89D6FF' : 'transparent',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {children}
      </div>
    );
  }
}

ColumnTarget.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired,
  isOver: PropTypes.bool.isRequired
};

export default DropTarget(contentTypes, target, collect)(ColumnTarget);
