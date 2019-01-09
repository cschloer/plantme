import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Image,
  StyleSheet, Dimensions,
  Text,
} from 'react-native';
import { Constants } from 'expo';
import SideSwipe from 'react-native-sideswipe';

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
  state = {
    currentIndex: 0,
  }

  render() {
    const { images } = this.props;
    if (images && images.length) {
      return (
        <SideSwipe
          index={this.state.currentIndex}
          itemWidth={width}
          style={{ width }}
          data={images}
          contentOffset={0}
          onIndexChange={index => this.setState(() => ({ currentIndex: index }))}
          renderItem={({
            itemIndex,
            currentIndex,
            item,
            animatedValue,
          }) => (
            <View
              key={itemIndex}
              index={itemIndex}
              currentIndex={currentIndex}
              animatedValue={animatedValue}
            >
              <Image
                style={styles.image}
                source={{ uri: item }}
              />
              <View style={styles.textOverlay}>
                <Text style={{ color: 'white' }}> {itemIndex + 1} of {images.length} </Text>
              </View>
            </View>
          )}
        />
      );
    }
    return null;
  }
}

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default Carousel;
