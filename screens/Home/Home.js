import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';
import { WebBrowser } from 'expo';
import { connect } from 'react-redux';

import { MonoText } from '../../components/StyledText';
import { styles } from '../styles';
import { logoutUser } from '../../reducers/login';

class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };

  signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.logoutUser();
    // this.props.navigation.navigate('App');
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
    console.log('user', this.props.user);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                /* eslint-disable global-require */
                /* eslint-disable no-undef */
                __DEV__
                  ? require('../../assets/images/robot-dev.png')
                  : require('../../assets/images/robot-prod.png')
                /* eslint-enable global-require */
                /* eslint-enable no-undef */
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this.maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>Welcome</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>{this.props.user.sub}</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this.handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          {this.props.user.sub
            ? (
              <Button title="Actually, sign me out :)" onPress={this.signOutAsync} />
            )
            : (
              <Button title="Sign me in!!" onPress={() => this.props.navigation.navigate('Auth')} />
            )
          }
        </View>
      </View>
    );
  }


}

Home.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  navigation: PropTypes.object,
  logoutUser: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
  };
};

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
