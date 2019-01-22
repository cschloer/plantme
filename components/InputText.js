import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'expo';
import { Input } from 'react-native-elements';

class InputText extends React.Component {

  // Render any loading content that you like here
  render() {
    const {
      onSubmit,
      onChangeText,
      value,
      label,
      labelStyle,
      multiline,
      submitDisabled,
      submitLoading,
    } = this.props;
    return (
      <Input
        multiline={multiline}
        onChangeText={onChangeText}
        value={value}
        label={label}
        labelStyle={labelStyle}
        rightIcon={submitLoading
          ? <ActivityIndicator size={32} />
          : (
            <TouchableOpacity
              onPress={onSubmit}
              disabled={submitDisabled}
            >
              <Icon.Feather
                name="plus"
                size={32}
              />
            </TouchableOpacity>
          )
        }
      />
    );
  }
}

InputText.propTypes = {
  onSubmit: PropTypes.func,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  label: PropTypes.string,
  labelStyle: PropTypes.object,
  multiline: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  submitLoading: PropTypes.bool,
};

InputText.defaultProps = {
  multiline: false,
  value: '',
  label: null,
  submitDisabled: false,
  submitLoading: false,
};

export default InputText;
