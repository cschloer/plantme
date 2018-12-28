import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'expo';

import { styles } from '../screens/styles';

class Error extends React.Component {

  state = {
    display: true,
  }

  // Render any loading content that you like here
  render() {
    const { display } = this.state;
    if (!display) {
      return null;
    }
    const { message } = this.props;
    return (
      <View style={styles.errorContainer}>
        <TouchableOpacity
          onPress={() => {
            this.setState({ display: false });
          }}
          style={styles.editSymbol}
        >
          <Icon.Feather
            name="x"
            size={24}
          />
        </TouchableOpacity>
        <Icon.Ionicons
          name={Platform.OS === 'ios' ? 'ios-sad' : 'md-sad'}
          size={64}
        />
        <Text>
          {message}
        </Text>
      </View>
    );
  }
}

Error.propTypes = {
  message: PropTypes.string,
};

Error.defaultProps = {
  message: 'There was an error',
};

export default Error;
