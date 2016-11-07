import React, { Component, PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import muiThemeable from 'material-ui/styles/muiThemeable';

class DialogInput extends Component {
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
    } else if (type === 'upadateVal') {
      this.setState({
        value: val.target.value
      });
    } else if (type === 'setVal') {
      this.setState({
        show: false
      }, () => {
        this.props.onChange(this.state.value);
      });
    }
  }

  render() {
    const { palette } = this.props.muiTheme;
    const actions = [
      <FlatButton
        label="Ok"
        onTouchTap={this.dispatch('setVal')}
      />,
      <FlatButton
        label="Cancel"
        onTouchTap={this.dispatch('toggle')}
      />
    ];
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
              backgroundColor: palette.canvasColor,
              borderRadius: '3px',
            }}
            onTouchTap={this.dispatch('toggle')}
          >
            {this.props.icon}
          </IconButton>
          <Dialog
            title={this.props.label}
            actions={actions}
            modal
            open={this.state.show}
            onRequestClose={this.dispatch('hide')}
          >
            <TextField
              onChange={this.dispatch('upadateVal')}
              floatingLabelText={this.props.floatingLabelText}
              value={this.state.value}
              fullWidth
            />
          </Dialog>
        </div>
      </div>
    );
  }
}

export default muiThemeable()(DialogInput);

DialogInput.propTypes = {
  muiTheme: PropTypes.object,
  icon: PropTypes.object.isRequired,
  initialValue: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  floatingLabelText: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

DialogInput.defaultProps = {
  onChange: () => {}
};
