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
  image: {
    height,
    width,
  },
});


class Carousel extends Component {
  state = {
    index: 0,
    modal: false,
  }

  render() {
    const { images } = this.props;
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
          style={styles.image}
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
};

export default Carousel;
