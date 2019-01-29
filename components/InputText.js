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
      submitVisible,
      iconName,
    } = this.props;
    let submitButton = null;
    if (submitVisible) {
      submitButton = submitLoading
        ? <ActivityIndicator size={32} />
        : (
          <TouchableOpacity
            onPress={onSubmit}
            disabled={submitDisabled}
          >
            <Icon.MaterialCommunityIcons
              name={iconName}
              size={32}
              disabled={submitDisabled}
            />
          </TouchableOpacity>
        );
    }
    return (
      <Input
        disabled={submitDisabled || submitLoading}
        multiline={multiline}
        onChangeText={onChangeText}
        value={value}
        label={label}
        labelStyle={labelStyle}
        rightIcon={submitButton}
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
  submitVisible: PropTypes.bool,
  submitDisabled: PropTypes.bool,
  submitLoading: PropTypes.bool,
  iconName: PropTypes.string,
};

InputText.defaultProps = {
  multiline: false,
  value: '',
  label: null,
  submitVisible: true,
  submitDisabled: false,
  submitLoading: false,
  iconName: 'plus',
};

export default InputText;
