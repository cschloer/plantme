import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  Button,
  ActivityIndicator,
} from 'react-native';
import { MapView } from 'expo';

import { Divider, Text } from 'react-native-elements';

import Error from '../../components/Error';
import UploadImage from '../../components/UploadImage';
import Carousel from '../../components/Carousel';

import { createTree } from '../../reducers/tree';
import { styles } from '../styles';

class TreeForm extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const title = state.params.title || 'Unknown species';
    return {
      title,
    };
  };

  state = {
    chosenSpecies: null,
    images: [],
  }

  componentWillReceiveProps(nextProps) {
    const { createTreeLoading: nextLoading, createTreeError: nextError } = nextProps.tree;
    const { createTreeLoading: prevLoading } = this.props.tree;
    if (prevLoading && !nextLoading && !nextError) {
      const onReturn = this.props.navigation.getParam('onReturn', false);
      if (onReturn) {
        onReturn();
      }
      this.props.navigation.navigate(
        'Map',
      );
    }
  }

  handleSelectSpecies = (chosenSpecies) => {
    this.setState({ chosenSpecies });
    this.props.navigation.setParams({
      title: chosenSpecies.name,
    });
  }

  createTree = () => {
    /* eslint-disable camelcase */
    const { sub: user_id } = this.props.user;
    /* eslint-enable camelcase */
    const longitude = this.props.navigation.getParam('longitude', false);
    const latitude = this.props.navigation.getParam('latitude', false);
    const { chosenSpecies, images } = this.state;

    this.props.createTree({
      user_id,
      latitude,
      longitude,
      species_votes: [{
        user_id,
        species_id: chosenSpecies.id,
      }],
      images: images.map(image => {
        return {
          url: image,
          user_id,
        };
      }),
    });
  }

  render() {
    const { images, chosenSpecies } = this.state;
    const {
      createTreeLoading, createTreeError,
    } = this.props.tree;
    const {
      generateImageUrlError,
    } = this.props.treeImage;
    let content = null;
    if (!chosenSpecies) {
      content = (
        <View style={{ padding: 5 }}>
          <View style={{ paddingVertical: 10 }}>
            <Button
              title="select a species"
              onPress={() => this.props.navigation.navigate(
                'SearchSpeciesModal',
                { onSpeciesSelect: this.handleSelectSpecies },
              )}
              buttonStyle={{ paddingBottom: 5 }}
            />
          </View>
          <View style={{ paddingTop: 10 }}>
            <Button
              title="identification help"
              onPress={() => this.props.navigation.navigate(
                'SearchSpeciesModal',
                { onSpeciesSelect: this.handleSelectSpecies },
              )}
            />
          </View>
        </View>
      );
    } else {
      content = (
        <View style={{ padding: 5 }}>
          {images.length === 0 && (
            <Text style={{ textAlign: 'center' }}>No images. Why not add one?</Text>
          )}
          <Carousel
            images={images}
          />
          <UploadImage
            onImageUpload={
              imageUrl => this.setState({ images: [...images, imageUrl] })
            }
            topRight={images.length !== 0}
            size={32}
          />
        </View>
      );

    }
    const longitude = this.props.navigation.getParam('longitude', false);
    const latitude = this.props.navigation.getParam('latitude', false);
    return (
      <View style={styles.container}>
        <View style={{ height: '100%' }}>
          <View style={{ height: '30%' }}>
            <MapView
              style={{ flex: 1 }}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0011,
                longitudeDelta: 0.005,
              }}
              zoomEnabled={false}
              rotateEnabled={false}
              scrollEnabled={false}
              showsUserLocation
              showsMyLocationButton={false}
            >
              <MapView.Marker
                coordinate={{
                  latitude,
                  longitude,
                }}
                pinColor="blue"
              />
            </MapView>
          </View>
          {content}
        </View>
        {this.state.chosenSpecies && (
          <View style={styles.createTreeButton}>
            {createTreeLoading
              ? <ActivityIndicator size={32} />
              : (
                <Button
                  title="add tree"
                  onPress={this.createTree}
                />
              )
            }
          </View>
        )}
        <View style={styles.tabBarInfoContainer}>
          {createTreeError && <Error message={createTreeError} />}
          {generateImageUrlError && <Error message={generateImageUrlError} />}
        </View>
      </View>
    );
  }
}
// TODO: clear generateImageUrlError when you switch between screens

TreeForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  tree: PropTypes.shape({
    createTreeLoading: PropTypes.bool,
    createTreeError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  treeImage: PropTypes.shape({
    generateImageUrlError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  navigation: PropTypes.object,
  createTree: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    tree: state.tree,
    treeImage: state.treeImage,
  };
};

const mapDispatchToProps = {
  createTree,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeForm);
