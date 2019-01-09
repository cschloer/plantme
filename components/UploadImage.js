import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ImageEditor,
  ImageStore,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Icon, ImagePicker,
  Permissions,
} from 'expo';

import { generateImageUrl } from '../reducers/treeImage';
import { styles } from '../screens/styles';

class UploadImage extends React.Component {

  state = {
    imageConvertLoading: false,
    imageConvertError: false,
  };


  componentWillReceiveProps(nextProps) {
    const {
      generateImageUrlLoading: nextImageLoading,
      generateImageUrlError: nextImageError,
    } = nextProps.treeImage;
    const { generateImageUrlLoading: prevImageLoading } = this.props.treeImage;
    if (prevImageLoading && !nextImageLoading && !nextImageError) {
      const { imageUrl } = nextProps.treeImage;
      this.props.onImageUpload(imageUrl);
    }
  }

  uploadImage = async (camera) => {
    let result = null;
    if (camera) {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA, Permissions.CAMERA_ROLL
      );
      if (status !== 'granted') {
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        base64: true,
      });

    } else {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA_ROLL
      );
      if (status !== 'granted') {
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: 'Images',
        // base64: true,
      });
    }

    if (!result.cancelled) {

      const resizedImageTag = await new Promise((resolve, reject) => {
        ImageEditor.cropImage(
          result.uri,
          {
            offset: { x: 0, y: 0 },
            size: { width: result.width, height: result.height },
            displaySize: { width: 1000, height: result.height / (result.width / 1000) },
            resizeMode: 'contain',
          },
          (uri) => resolve(uri),
          () => reject(),
        );
      });
      const base64 = await new Promise((resolve, reject) => {
        ImageStore.getBase64ForTag(
          resizedImageTag,
          (base64Result) => resolve(base64Result),
          () => reject(),
        );
      });

      const { sub } = this.props.user;
      // Generate storage URL
      this.props.generateImageUrl(
        base64,
        `${sub}.jpeg`,
        'image/jpeg',
      );
      // Remove the cropped image from the store
      if (Platform.OS === 'ios') {
        await new Promise(() => {
          ImageStore.removeImageForTag(
            resizedImageTag,
          );
        });
      }
    }
  };

  render() {
    const { imageConvertLoading, imageConvertError } = this.state;
    const { generateImageUrlLoading } = this.props.treeImage;
    let style = [styles.addSymbol, { flexDirection: 'row', padding: 5 }];
    if (this.props.topRight) {
      style = [
        styles.topRightSymbol,
        { backgroundColor: 'rgba(255, 255, 255, .5)' },
      ];
    }
    if (imageConvertLoading || generateImageUrlLoading || this.props.otherLoading) {
      return (
        <View style={style}>
          <ActivityIndicator size={this.state.size} />
        </View>
      );
    }

    return (
      <View style={style}>
        <TouchableOpacity
          onPress={() => { this.uploadImage(true); }}
          disabled={imageConvertLoading}
          style={{ marginHorizontal: 4 }}
        >
          <Icon.MaterialIcons
            name="camera-alt"
            size={this.props.size}
            color={this.props.color}
          />

        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { this.uploadImage(false); }}
          disabled={imageConvertLoading}
          style={{ marginHorizontal: 4 }}
        >
          <Icon.MaterialIcons
            name="photo-library"
            size={this.props.size}
            color={this.props.color}
          />

        </TouchableOpacity>
      </View>
    );
  }
}

UploadImage.propTypes = {
  topRight: PropTypes.bool,
  onImageUpload: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.number,
  otherLoading: PropTypes.bool,
  generateImageUrl: PropTypes.func,
  treeImage: PropTypes.shape({
    generateImageUrlLoading: PropTypes.bool,
    imageUrl: PropTypes.string,
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
};

UploadImage.defaultProps = {
  topRight: false,
  color: 'black',
  size: 64,
  otherLoading: false,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    treeImage: state.treeImage,
  };
};

const mapDispatchToProps = {
  generateImageUrl,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadImage);
