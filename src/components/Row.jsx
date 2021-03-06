import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import { DragSource, DropTarget } from 'react-dnd';
import equal from 'deep-equal';
import manifest from '../lib/manifest';
import { source, collect as collectSource } from '../lib/generic-drag-source';
import { target } from '../lib/generic-drop-target';
import Column from './Column';
import trash from '../assets/trash.svg';

const rowSource = Object.assign({}, source, {
  beginDrag(props, monitor, component) {
    return {
      ...props,
      component
    };
  }
});

const rowTarget = Object.assign({}, target, {
  canDrop() {
    return false;
  },
  hover(props, monitor) {
    const { inCanvas: targetInCanvas, id: overId, reorderRows } = props;
    if (targetInCanvas) {
      const {
        id: draggedId,
        inCanvas: sourceInCanvas
      } = monitor.getItem();
      const { y } = monitor.getClientOffset();
      if (draggedId !== overId) {
        const {
          top: overTop,
          height: overHeight
        } = document.getElementById(`ROW-${overId}`).getBoundingClientRect();
        if (y <= (overTop + (overHeight / 2))) {
          if (sourceInCanvas) {
            reorderRows(draggedId, 'before', overId);
          }
          // component.decoratedComponentInstance.showDropHelper('top');
        } else if (y > (overTop + (overHeight / 2)) && y <= overTop + overHeight) {
          if (sourceInCanvas) {
            reorderRows(draggedId, 'after', overId);
          }
          // component.decoratedComponentInstance.showDropHelper('bottom');
        }
      }
    }
  }
});

const collectTarget = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

const RowActionContainer = styled.div`
  background: #fff;
  padding:5px;
  position:absolute;
  top:0;
  left:0;
  display: ${({ show }) => show ? 'inline-block' : 'none'}
`;

const CloseButton = styled('div')`
  height: 20px;
  width: 20px;
  position:relative;
  background-image: ${`url(${trash})`};
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
`;

const RowInToolbox = styled.div`  
  display: block;
  margin-bottom: 10px;
  height: 5em;
  border-radius: 2px;
  border: 3px solid #303030;
  transition: 0.1s all cubic-bezier(0,.79,.44,.71);
  
  &:hover {
    box-shadow: 0 6px 10px rgba(0,0,0,.35);
  }
  
  &:active {
    transform: scale(1.05);
  }
`;

class Row extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showClose: false,
      dropHelper: null
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !equal(this.props, nextProps) || !equal(this.state, nextState);
  }

  showDropHelper = (position) => {
    this.setState({
      dropHelper: position
    });
  }

  toggleClose = (val, cb) => () => {
    this.setState({
      showClose: val
    }, () => {
      if (cb) {
        cb();
      }
    });
  }

  render() {
    const {
      id,
      type,
      numCols,
      inCanvas,
      disableDrag,
      isDragging,
      isOver,
      getPropsForColumn,
      addContent,
      updateRef,
      removeRow,
      pushToUndoStack,
      setCustom,
      connectDragSource,
      connectDragPreview,
      connectDropTarget
    } = this.props;

    const { showClose, dropHelper } = this.state;

    return (
      connectDropTarget(connectDragPreview(connectDragSource(
        <div
          id={`${type}-${id}`}
          style={{
            cursor: disableDrag ? 'default' : 'move',
            opacity: isDragging ? inCanvas ? 0.4 : 0.4 : 1, // eslint-disable-line
            transition: 'opacity 0.2s ease-in-out',
            position: showClose && inCanvas ? 'relative' : 'static',
            zIndex: showClose && inCanvas ? 1499 : 1,
            outline: showClose && inCanvas ? '2px solid #4CB9EA' : 'none',
            background: showClose && inCanvas ? 'rgba(120,171,193,0.2)' : 'transparent',
            borderTop: dropHelper && isOver && dropHelper === 'top' ? '4px dashed red' : 'none',
            borderBottom: dropHelper && isOver && dropHelper === 'bottom' ? '4px dashed red' : 'none'
          }}
          onMouseEnter={this.toggleClose(true)}
          onMouseOver={this.toggleClose(true)}
          onMouseLeave={this.toggleClose(false)}
        >
          {
            inCanvas ?
              <div>
                <RowActionContainer show={showClose}>
                  <CloseButton onClick={removeRow(id)} />
                </RowActionContainer>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    alignContent: 'stretch',
                    margin: '0 auto',
                    padding: '0 16px',
                    width: '584px',
                  }}
                >
                  {
                    [...Array(numCols).keys()].map(key =>
                      <Column
                        {...getPropsForColumn(key)}
                        inCanvas
                        addContent={addContent}
                        updateRef={updateRef}
                        pushToUndoStack={pushToUndoStack}
                        setCustom={setCustom}
                        key={key}
                      />
                    )
                  }
                </div>
              </div>
            :
              <RowInToolbox>
                {
                  [...Array(numCols).keys()].map(key =>
                    <Column
                      rowId={id}
                      colIndex={key}
                      numCols={numCols}
                      key={key}
                    />
                  )
                }
              </RowInToolbox>
          }
        </div>,
        { dropEffect: 'copy' }
      ), { captureDraggingState: true }))
    );
  }
}

Row.propTypes = {
  type: PropTypes.string.isRequired,
  numCols: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  inCanvas: PropTypes.bool,
  getPropsForColumn: PropTypes.func,
  removeRow: PropTypes.func,
  addContent: PropTypes.func,
  updateRef: PropTypes.func,
  pushToUndoStack: PropTypes.func,
  setCustom: PropTypes.func,
  disableDrag: PropTypes.bool,
  isDragging: PropTypes.bool.isRequired,
  isOver: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDragPreview: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired
};

Row.defaultProps = {
  inCanvas: false,
  disableDrag: false
};

export default DropTarget(manifest.ROW, rowTarget, collectTarget)(DragSource(manifest.ROW, rowSource, collectSource)(Row)); // eslint-disable-line
