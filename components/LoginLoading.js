import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import jwtDecoder from 'jwt-decode';
import { connect } from 'react-redux';

import { setUserProfile } from '../reducers/login';
import { getUserPlants } from '../reducers/userPlant';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class LoginLoading extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // Parse user token and add to the store
    if (userToken) {
      const decodedToken = jwtDecoder(userToken);
      const { name, sub } = decodedToken;
      this.props.setUserProfile({
        name,
        sub,
      });
      this.props.getUserPlants(sub);
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate('App');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={64} />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

LoginLoading.propTypes = {
  setUserProfile: PropTypes.func,
  getUserPlants: PropTypes.func,
  navigation: PropTypes.object,
};

const mapDispatchToProps = {
  setUserProfile,
  getUserPlants,
};

export default connect(null, mapDispatchToProps)(LoginLoading);
