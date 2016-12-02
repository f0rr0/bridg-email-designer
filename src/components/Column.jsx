import React, { Component, PropTypes } from 'react';
import styled, { css } from 'styled-components';
import ColumnTarget from './ColumnTarget';

const ContainerInToolbox = styled('div')`
  display: inline-block;
  width: ${({ col }) => css`${100 / col}%`}
  height: 100%;
  border-right: 3px solid #303030;
  background: #FFF;

  &:last-child {
    border-right: none;
  }
`;

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  align-content: stretch;
  width: ${({ col }) => css`${100 / col}%`}
  border: 1px dashed #303030;
`;

export default class Column extends Component {
  constructor(props) {
    super(props);
    this.components = [];
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.inCanvas) {
      return !nextProps.contents.equals(this.props.contents);
    }
    return true;
  }

  triggerRefsUpdate() {
    const { updateRef, rowId, colIndex } = this.props;
    const components = this.components;
    if (components.length > 0) {
      updateRef(rowId, colIndex, components);
    }
  }

  renderContent() {
    const { contents, inCanvas, setCustom, pushToUndoStack } = this.props;
    if (inCanvas) {
      return contents.map((content, index) => {
        const ComponentForType = content.get('component');
        const type = content.get('type');
        // const id = content.get('id');
        let state = null;
        if (content.has('state')) {
          state = content.get('state');
        }
        return (
          <ComponentForType
            type={type}
            key={index}
            // id={id}
            state={state}
            pushToUndoStack={pushToUndoStack}
            setCustom={setCustom}
            inCanvas
            disableDrag
            ref={(c) => {
              if (c) {
                this.components[index] = {
                  type,
                  component: c.decoratedComponentInstance
                };
                this.triggerRefsUpdate();
              }
            }}
          />
        );
      }).toJS();
    }
    return [null];
  }

  render() {
    const { numCols, addContent, rowId, colIndex, inCanvas } = this.props;
    if (inCanvas) {
      return (
        <Container col={numCols}>
          <ColumnTarget
            onDrop={({ type }) => {
              addContent(rowId, colIndex, {
                type
              });
            }}
          >
            {this.renderContent()}
          </ColumnTarget>
        </Container>
      );
    }
    return (
      <ContainerInToolbox col={numCols} />
    );
  }
}

Column.propTypes = {
  inCanvas: PropTypes.bool,
  numCols: PropTypes.number.isRequired,
  addContent: PropTypes.func,
  updateRef: PropTypes.func,
  setCustom: PropTypes.func,
  pushToUndoStack: PropTypes.func,
  contents: PropTypes.object,
  rowId: PropTypes.string.isRequired,
  colIndex: PropTypes.number.isRequired
};
