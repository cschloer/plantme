import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Icon } from 'expo';

import { styles } from '../screens/styles';

class DeleteButton extends React.Component {

  render() {
    const { deleteFunc, alertTitle, alertText } = this.props;
    return (
      <TouchableOpacity
        onPress={() => {
          Alert.alert(
            alertTitle,
            alertText,
            [
              {
                text: 'yes',
                onPress: () => {
                  deleteFunc();
                },
              },
              { text: 'no', onPress: null },
            ],
            { cancelable: true }
          );
        }}
        style={styles.topRightSymbol}
      >
        <Icon.Feather
          name="x"
          size={16}
        />
      </TouchableOpacity>
    );
  }
}

DeleteButton.propTypes = {
  deleteFunc: PropTypes.func,
  alertTitle: PropTypes.string,
  alertText: PropTypes.string,
};

DeleteButton.defaultProps = {
  alertTitle: null,
  alertText: 'Are you sure you want delete that?',
};

export default DeleteButton;
