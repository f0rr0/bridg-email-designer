import React, { Component, PropTypes } from 'react';
import { ChromePicker } from 'react-color';
import ClickOutside from 'react-click-outside';
import uniqueid from 'lodash.uniqueid';
import IconButton from 'material-ui/IconButton';
import Fill from 'material-ui/svg-icons/editor/format-color-fill';
import { emphasize, fade } from 'material-ui/utils/colorManipulator';
import muiThemeable from 'material-ui/styles/muiThemeable';

const serializeRGBA = ({ r, g, b, a }) => `rgba(${r}, ${g}, ${b}, ${a})`; // TODO: Memoize this

class ColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue,
      show: false
    };
    this.uniqueid = uniqueid();
  }

  dispatch = type => (val) => {
    if (type === 'toggle') {
      this.setState({
        show: !this.state.show
      });
    } else if (type === 'hide') {
      if (!document.getElementById(this.uniqueid).contains(val.target)) {
        this.setState({
          show: false
        });
      }
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
    const Icon = this.props.icon;
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
        <div id={this.uniqueid}>
          <IconButton
            style={{
              backgroundColor: this.state.value,
              borderRadius: '3px',
            }}
            onTouchTap={this.dispatch('toggle')}
            className={this.uniqueid}
          >
            <Icon color={fade(emphasize(this.state.value, 1), 1)} />
          </IconButton>
          {
            this.state.show ?
              <ClickOutside
                onClickOutside={this.dispatch('hide')}
              >
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
              </ClickOutside>
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
  icon: PropTypes.func,
  initialValue: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

ColorPicker.defaultProps = {
  icon: Fill,
  initialValue: 'rgba(255, 255, 255, 1)',
  onChange: () => {}
};
