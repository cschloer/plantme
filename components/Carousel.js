import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, ScrollView, Image,
  StyleSheet, Dimensions,
  Text,
} from 'react-native';
import { Constants } from 'expo';

const { width } = Dimensions.get('window');
const height = width * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  scrollContainer: {
    height,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10000,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  image: {
    width,
    height,
  },
});


class Carousel extends Component {
  render() {
    const { images } = this.props;
    if (images && images.length) {
      return (
        <View
          style={styles.scrollContainer}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {images.map((image, i) => (
              <View key={i}>
                <Image
                  style={styles.image}
                  source={{ uri: image }}
                />
                <View style={styles.textOverlay}>
                  <Text style={{ color: 'white' }}> {i + 1} of {images.length} </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      );
    }
    return null;
  }
}

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default Carousel;
