import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Icon } from 'expo';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8d7da',
    color: '#fff',
  },
});

class Error extends React.Component {

  // Render any loading content that you like here
  render() {
    const { message } = this.props;
    return (
      <View style={styles.container}>
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
