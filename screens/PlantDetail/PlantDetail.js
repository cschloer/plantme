import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageStore,
  ImageEditor,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, ImagePicker, ImageManipulator } from 'expo';
import { Divider, Text, Input } from 'react-native-elements';

import Loading from '../../components/Loading';
import Error from '../../components/Error';
import SavePlantDetail from './SavePlantDetail';
import { getSingleUserPlant, createUserPlantImage } from '../../reducers/userPlant';
import { generateImageUrl } from '../../reducers/userPlantImage';
import { styles } from '../styles';

class PlantDetail extends React.Component {

  state = {
    editMode: false,
    form: {},
    imageConvertLoading: false,
    imageConvertError: false,
  };

  componentDidMount() {
    const plantId = this.props.navigation.getParam('plantId', false);
    if (plantId) {
      this.props.getSingleUserPlant(plantId);
    } else {
      // TODO error
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      updatePlantLoading: nextLoading,
      updatePlantError: nextError,
    } = nextProps.userPlant;
    const { updatePlantLoading: prevLoading } = this.props.userPlant;
    if (prevLoading && !nextLoading && !nextError) {
      this.setState({ editMode: false });
    }
    const {
      generateImageUrlLoading: nextImageLoading,
      generateImageUrlError: nextImageError,
    } = nextProps.userPlantImage;
    const { generateImageUrlLoading: prevImageLoading } = this.props.userPlantImage;
    if (prevImageLoading && !nextImageLoading && !nextImageError) {
      const { imageUrl } = nextProps.userPlantImage;
      const { id } = this.props.userPlant.singlePlant;
      this.props.createUserPlantImage(id, imageUrl);
    }

  }

  uploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      this.setState({
        imageConvertLoading: true,
        imageConvertError: false,
      });
      // Resize the image
      const manipResult = await ImageManipulator.manipulateAsync(
        result.uri,
        [{ resize: { width: 600 } }],
        { base64: true },
      );
      this.setState({ imageConvertLoading: false });
      const { sub } = this.props.user;
      const { id: plantId } = this.props.userPlant.singlePlant;
      // Generate storage URL
      this.props.generateImageUrl(
        manipResult.base64,
        `${sub}-${plantId}.jpeg`,
        'image/jpeg',
      );
    }
  };

  render() {
    const { navigation, userPlant, userPlantImage } = this.props;
    const { singlePlant, singlePlantLoading, singlePlantError } = userPlant;
    const plantId = navigation.getParam('plantId', false);

    if (singlePlantError || !plantId) {
      return (
        <Error message={singlePlantError} />
      );
    }
    if (singlePlantLoading) {
      return (
        <Loading />
      );
    }
    const {
      created,
      id,
      name,
      images = [],
    } = singlePlant;

    const { editMode } = this.state;

    const editButton = (
      <TouchableOpacity
        style={styles.editSymbol}
        onPress={() => {
          this.setState({
            editMode: !editMode,
            form: {
              name,
            },
          });
        }}
      >
        <Icon.Feather
          name={editMode ? 'x' : 'edit-2'}
          size={32}
        />
      </TouchableOpacity>
    );

    const imageGroup = images.map((image, i) => (
      <View key={i}>
        <Divider style={styles.divider} />
        <Image
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 200,
            height: 200,
          }}
          source={{ uri: image.url }}
        />
      </View>
    ));

    if (editMode) {
      const { form, imageConvertError, imageConvertLoading } = this.state;
      const {
        updatePlantLoading, updatePlantError,
        createUserPlantImageLoading, createUserPlantImageError,
      } = userPlant;
      const {
        generateImageUrlLoading, generateImageUrlError,
      } = userPlantImage;
      return (
        <View style={styles.container}>
          {editButton}
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.secondPageContentContainer}
          >
            <Input
              value={form.name}
              onChangeText={(text) => this.setState(
                { form: { ...form, name: text } }
              )}
              inputStyle={styles.h1Form}
              label="name"
              editable={!updatePlantLoading}
            />
            <Text styles={styles.listText}>created {created}</Text>
            <View style={styles.imageGroupView}>
              <Divider style={styles.divider} />
              <TouchableOpacity
                style={styles.addSymbol}
                onPress={this.uploadImage}
                disabled={imageConvertLoading}
              >
                {(imageConvertLoading || createUserPlantImageLoading || generateImageUrlLoading)
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
              {imageGroup}
            </View>
          </ScrollView>
          <View style={styles.tabBarInfoContainer}>
            <SavePlantDetail form={form} plantId={id} />
            {updatePlantError && <Error message={updatePlantError} />}
            {imageConvertError && <Error message={imageConvertError} />}
            {generateImageUrlError && <Error message={generateImageUrlError} />}
            {createUserPlantImageError && <Error message={createUserPlantImage} />}
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {editButton}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.secondPageContentContainer}
        >
          <Text h1 style={styles.listText}>{name}</Text>
          <Text style={styles.listText}>created {created}</Text>
          <View style={styles.imageGroupView}>
            {images.length === 0 && (
              <View>
                <Divider style={styles.divider} />
                <Text style={{ textAlign: 'center' }}>
                  no pictures :( why not add one?
                </Text>
              </View>
            )}
            {imageGroup}
          </View>
        </ScrollView>
      </View>
    );
  }

}

PlantDetail.propTypes = {
  navigation: PropTypes.object,
  getSingleUserPlant: PropTypes.func,
  generateImageUrl: PropTypes.func,
  createUserPlantImage: PropTypes.func,
  userPlant: PropTypes.shape({
    singlePlant: PropTypes.shape({
      created: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
      user_id: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.shape({
        url: PropTypes.string,
      })),
    }),
    singlePlantLoading: PropTypes.bool,
    singlePlantError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    updatePlantLoading: PropTypes.bool,
    updatePlantError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    createUserPlantImageLoading: PropTypes.bool,
    createUserPlantImageError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  userPlantImage: PropTypes.shape({
    generateImageUrlLoading: PropTypes.bool,
    generateImageUrlError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    imageUrl: PropTypes.string,
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    userPlant: state.userPlant,
    userPlantImage: state.userPlantImage,
  };
};

const mapDispatchToProps = {
  getSingleUserPlant,
  generateImageUrl,
  createUserPlantImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlantDetail);
