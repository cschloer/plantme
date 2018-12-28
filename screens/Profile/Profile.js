import React from 'react';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser, Icon } from 'expo';
import { connect } from 'react-redux';

import PlantCard from '../../components/PlantCard';
import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { createUserPlant } from '../../reducers/userPlant';
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
    const { 
      plantsLoading, plantsError, plants,
      createPlantLoading, createPlantError,
    } = this.props.userPlant;
    if (plantsError) {
      return (
        <Error message={plantsError} />
      );
    }
    if (plantsLoading) {
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
                deletable
              />
            ))
          }
          <TouchableOpacity
            style={styles.addSymbol}
            onPress={() => {
              this.props.createUserPlant({
                user_id: this.props.user.sub,
                name: 'new plant',
              });
            }}
            disabled={createPlantLoading}
          >
            {createPlantLoading
              ? (
                <ActivityIndicator size={64} />
              ) : (
                <Icon.Feather
                  name="plus"
                  size={64}
                />
              )
            }
          </TouchableOpacity>
        </ScrollView>
        {createPlantError && (
          <View style={styles.tabBarInfoContainer}>
            <Error message={createPlantError} />
          </View>
        )}
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
    plantsLoading: PropTypes.bool,
    plantsError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    plants: PropTypes.array,
    createPlantLoading: PropTypes.bool,
    createPlantError: PropTypes.bool,
  }),
  navigation: PropTypes.object,
  createUserPlant: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    userPlant: state.userPlant,
  };
};

const mapDispatchToProps = {
  createUserPlant,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
