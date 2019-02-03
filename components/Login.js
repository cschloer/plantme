import { AuthSession, Icon, Constants } from 'expo';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Button,
  StyleSheet,
  View,
  AsyncStorage,
} from 'react-native';
import jwtDecoder from 'jwt-decode';
import { connect } from 'react-redux';
import axios from 'axios';

import { setUserProfile } from '../reducers/login';

const { manifest } = Constants;

/*
  You need to swap out the Auth0 client id and domain with
  the one from your Auth0 client.
  In your Auth0 clent, you need to also add a url to your authorized redirect urls.
  For this application, I added https://auth.expo.io/@community/auth0-example because
  I am signed in as the "community" account on Expo and the slug for this app is "auth0-example".
  You can open this app in the Expo client
  and check your logs for "Redirect URL (add this to Auth0)"
  to see what URL to add if the above is confusing.
  If you use Facebook through Auth0, be sure to follow this guide: https://auth0.com/docs/connections/social/facebook
*/
const auth0ClientId = '8wrsnEvmPcfkC6kzsXw36x9GsPyKcAnA';
const auth0Domain = 'https://treemap.auth0.com';

/**
 * Converts an object to a query string.
 */
function toQueryString(params) {
  const query = Object.entries(params).map(
    ([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  ).join('&');
  return `?${query}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 40,
  },
});


class Login extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Icon.Feather
          style={{ paddingLeft: 20 }}
          onPress={() => navigation.navigate('App')}
          name="arrow-left"
          size={32}
        />
      ),
    };
  };

  static tokenIsExpired = async () => {
    const tokenExpireTimeString = await AsyncStorage.getItem('tokenExpireTime');
    let tokenExpireTime = Number.parseFloat(tokenExpireTimeString);
    if (!tokenExpireTime) {
      tokenExpireTime = 0;
    }
    return tokenExpireTime - Date.now() - 10000 < 0;

  };

  static refreshAccessToken = async () => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const res = await axios.post(
      `${auth0Domain}/oauth/token`,
      {
        grant_type: 'refresh_token',
        client_id: auth0ClientId,
        refresh_token: refreshToken,
      },
    );
    const {
      access_token: accessToken,
      expires_in: expiresIn,
      id_token: idToken,
    } = res.data;
    await AsyncStorage.multiSet([
      ['tokenExpireTime', `${expiresIn * 1000 + Date.now()}`],
      ['idToken', idToken],
      ['accessToken', accessToken],
    ]);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return accessToken;
  };

  static login = async (navigation, setUserProfile2) => {
    const apiUrl = 'http://'.concat(manifest.debuggerHost.split(':').shift().concat(':5000'));
    const cryptoRes = await axios.get(`${apiUrl}/crypto`);
    const { challenge, verifier } = cryptoRes.data;

    const redirectUrl = AuthSession.getRedirectUrl();
    const queryString = toQueryString({
      client_id: auth0ClientId,
      response_type: 'code',
      scope: 'openid email profile offline_access',
      audience: 'https://treemap/',
      // nonce: await this.getNonce(),
      code_challenge: challenge,
      code_challenge_method: 'S256',
      redirect_uri: redirectUrl,
    });
    const authRes = await AuthSession.startAsync({
      authUrl: `${auth0Domain}/authorize${queryString}`,
    });


    if (authRes.params.error) {
      Alert.alert(
        'Error',
        authRes.params.error_description || 'Something went wrong while logging in',
      );
      return;
    }
    const { code } = authRes.params;
    const tokenRes = await axios.post(
      `${auth0Domain}/oauth/token`,
      {
        grant_type: 'authorization_code',
        client_id: auth0ClientId,
        code_verifier: verifier,
        code,
        redirect_uri: redirectUrl,
      },
    );
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      id_token: idToken,
      expires_in: expiresIn,
    } = tokenRes.data;

    const { name, sub } = jwtDecoder(idToken);
    setUserProfile2({
      name,
      sub,
    });
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    await AsyncStorage.multiSet([
      ['tokenExpireTime', `${expiresIn * 1000 + Date.now()}`],
      ['idToken', idToken],
      ['accessToken', accessToken],
      ['refreshToken', refreshToken],
    ]);
    // this.props.navigation.navigate('App');

  }

  loginWithAuth0 = async () => {
    const apiUrl = 'http://'.concat(manifest.debuggerHost.split(':').shift().concat(':5000'));
    const res = await axios.get(`${apiUrl}/crypto`);
    const { challenge, verifier } = res.data;

    const redirectUrl = AuthSession.getRedirectUrl();
    const queryString = toQueryString({
      client_id: auth0ClientId,
      response_type: 'code',
      scope: 'openid email profile offline_access',
      audience: 'https://treemap/',
      // nonce: await this.getNonce(),
      code_challenge: challenge,
      code_challenge_method: 'S256',
      redirect_uri: redirectUrl,
    });
    const result = await AuthSession.startAsync({
      authUrl: `${auth0Domain}/authorize${queryString}`,
    });


    if (result.type === 'success') {
      this.handleParams(result.params, verifier, redirectUrl);
    }
  }

  handleParams = async (responseObj, verifier, redirectUri) => {
    if (responseObj.error) {
      Alert.alert('Error', responseObj.error_description
        || 'something went wrong while logging in');
      return;
    }
    const { code } = responseObj;
    const res = await axios.post(
      `${auth0Domain}/oauth/token`,
      {
        grant_type: 'authorization_code',
        client_id: auth0ClientId,
        code_verifier: verifier,
        code,
        redirect_uri: redirectUri,
      },
    );
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      id_token: idToken,
      expires_in: expiresIn,
    } = res.data;

    const { name, sub } = jwtDecoder(idToken);
    this.props.setUserProfile({
      name,
      sub,
    });
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    await AsyncStorage.setItem('tokenExpireTime', `${expiresIn * 1000 + Date.now()}`);
    await AsyncStorage.setItem('idToken', idToken);
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    // this.props.navigation.navigate('App');
  }

  generateRandomString = length => {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
    return [...Array(length)]
      .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
      .join('');
  };

  getNonce = async () => {
    let nonce = await AsyncStorage.getItem('nonce');
    if (!nonce) {
      nonce = this.generateRandomString(16);
      await AsyncStorage.setItem('nonce', nonce);
    }
    return nonce;
  };


  render() {
    return (
      <View style={styles.container}>
        <View>
          <Button title="Login with Auth0" onPress={this.loginWithAuth0} />
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  setUserProfile: PropTypes.func,
  navigation: PropTypes.object,
};

const mapDispatchToProps = {
  setUserProfile,
};

export default connect(null, mapDispatchToProps)(Login);
