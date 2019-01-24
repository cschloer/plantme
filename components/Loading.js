import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class Loading extends React.Component {

  // Render any loading content that you like here
  render() {
    const { size, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size={size} />
      </View>
    );
  }
}

Loading.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
};

Loading.defaultProps = {
  size: 32,
  style: {},
};

export default Loading;
