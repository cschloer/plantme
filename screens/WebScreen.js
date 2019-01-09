import React from 'react';
import PropTypes from 'prop-types';
import {
  WebView,
} from 'react-native';

import Loading from '../components/Loading';

class WebScreen extends React.Component {

  // Render any loading content that you like here
  render() {
    const uri = this.props.navigation.getParam('uri', null);
    return (
      <WebView
        source={{ uri }}
        renderLoading={() => <Loading />}
        startInLoadingState
      />
    );
  }
}

WebScreen.propTypes = {
  navigation: PropTypes.object,
};

export default WebScreen;
