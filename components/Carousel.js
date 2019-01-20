import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View, Modal,
  StyleSheet, Dimensions,
  Text,
} from 'react-native';
import { Constants } from 'expo';
import ImageViewer from 'react-native-image-zoom-viewer';

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
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, .5)',
  },
  imageSmall: {
    height: height / 2,
    width,
  },
  imageMedium: {
    height,
    width,
  },
  imageLarge: {
    height: height * 1.5,
    width,
  },
});


class Carousel extends Component {
  state = {
    index: 0,
    modal: false,
  }

  render() {
    const { images, size } = this.props;
    let imageSize = null;
    switch (size) {
      case 'medium':
        imageSize = styles.imageMedium;
        break;
      case 'large':
        imageSize = styles.imageLarge;
        break;
      default:
        imageSize = styles.imageSmall;
    }
    if (images && images.length) {
      const { modal } = this.state;
      if (modal) {
        return (
          <Modal
            visible
            transparent
            onRequestClose={() => this.setState({ modal: false })}
          >
            <ImageViewer
              imageUrls={images.map((image) => { return { url: image }; })}
              index={this.state.index}
              renderIndicator={(currentIndex, totalSize) => (
                <View style={styles.textOverlay}>
                  <Text style={{ color: 'black' }}> {currentIndex} of {totalSize} </Text>
                </View>
              )}
              saveToLocalByLongPress={false}
            />
          </Modal>
        );
      }
      return (
        <View
          style={imageSize}
        >
          <ImageViewer
            imageUrls={images.map((image) => {
              return {
                url: image,
              };
            })}
            index={this.state.index}
            onChange={index => this.setState({ index })}
            onClick={() => this.setState({ modal: true })}
            backgroundColor="white"
            renderIndicator={(currentIndex, totalSize) => (
              <View style={styles.textOverlay}>
                <Text style={{ color: 'black' }}> {currentIndex} of {totalSize} </Text>
              </View>
            )}
            saveToLocalByLongPress={false}
          />
        </View>
      );
    }
    return null;
  }
}

Carousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

Carousel.defaultProps = {
  size: 'medium',
};

export default Carousel;
