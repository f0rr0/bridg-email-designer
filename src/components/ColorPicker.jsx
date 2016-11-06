import React, { Component, PropTypes } from 'react';
import { ChromePicker } from 'react-color';
import IconButton from 'material-ui/IconButton';
import Fill from 'material-ui/svg-icons/editor/format-color-fill';
import { emphasize } from 'material-ui/utils/colorManipulator';
import muiThemeable from 'material-ui/styles/muiThemeable';

const serializeRGBA = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a})`; // TODO: Memoize this

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue,
      show: false
    };
  }

  dispatch = type => (val) => {
    if (type === 'toggle') {
      this.setState({
        show: !this.state.show
      });
    } else if (type === 'hide') {
      this.setState({
        show: false
      });
    } else if (type === 'setVal') {
      this.setState({
        value: serializeRGBA(val.rgb)
      }, () => {
        this.props.onChange(serializeRGBA(val.rgb));
      });
    }
  }

  render() {
    const { palette } = this.props.muiTheme;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 16,
            color: palette.textColor,
          }}
        >
          {this.props.label}
        </span>
        <div>
          <IconButton
            style={{
              backgroundColor: this.state.value,
              borderRadius: '3px',
            }}
            onTouchTap={this.dispatch('toggle')}
          >
            <Fill color={emphasize(this.state.value, 1)} />
          </IconButton>
          {
            this.state.show ?
              <div
                style={{
                  position: 'absolute',
                  marginLeft: '-178px',
                  zIndex: '2'
                }}
              >
                <ChromePicker
                  color={this.state.value}
                  onChangeComplete={this.dispatch('setVal')}
                />
              </div>
            :
              null
          }
        </div>
      </div>
    );
  }
}

export default muiThemeable()(ColorPicker);

ColorPicker.propTypes = {
  muiTheme: PropTypes.object,
  initialValue: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

ColorPicker.defaultProps = {
  initialValue: 'rgba(255, 255, 255, 1)',
  onChange: () => {}
};
