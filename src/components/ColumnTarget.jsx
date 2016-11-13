import React, { Component, PropTypes, Children } from 'react';
import equal from 'deep-equal';
import { DropTarget } from 'react-dnd';
import { target } from '../lib/generic-drop-target';
import manifest from '../lib/manifest';

const contentTypes = Object.values(manifest).filter(type => type !== 'ROW');

const columnTarget = Object.assign({}, target, {
  canDrop() {
    return true;
  }
});

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

class ColumnTarget extends Component {

  shouldComponentUpdate(nextProps) {
    return !equal(this.props, nextProps);
  }

  render() {
    const { connectDropTarget, isOver, canDrop, children } = this.props;
    return connectDropTarget(
      <div
        style={{
          width: '100%',
          height: Children.count(children) > 0 ? 'auto' : '5em',
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          outline: isOver && canDrop ? '4px solid red' : 'none',
          transition: 'all 0.1s ease-out'
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
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired
};

export default DropTarget(contentTypes, columnTarget, collect)(ColumnTarget);
