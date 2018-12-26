import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import { WebBrowser } from 'expo';
import { connect } from 'react-redux';

import PlantCard from '../../components/PlantCard';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { styles } from '../styles';

class Profile extends React.Component {
  static navigationOptions = {
    header: null,
  };

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };


  maybeRenderDevelopmentModeWarning = () => {
    /* eslint-disable no-undef */
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this.handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools.
          {learnMoreButton}
        </Text>
      );
    }
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode, your app will run at full speed.
      </Text>
    );
    /* eslint-enable no-undef */
  }

  handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };

  render() {
    const { loading, error, plants } = this.props.userPlant;
    if (error) {
      return (
        <Error message={error} />
      );
    }
    if (loading) {
      return (
        <Loading />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {
            plants.map((plant, i) => (
              <PlantCard
                key={i}
                plant={plant}
                navigation={this.props.navigation}
              />
            ))
          }
        </ScrollView>
      </View>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  userPlant: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    plants: PropTypes.array,
  }),
  navigation: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    userPlant: state.userPlant,
  };
};

export default connect(mapStateToProps, null)(Profile);
