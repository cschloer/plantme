import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { MapView } from 'expo';

import { Text } from 'react-native-elements';

import Error from '../../components/Error';
import UploadImage from '../../components/UploadImage';
import Carousel from '../../components/Carousel';
import InputText from '../../components/InputText';

import { createTree } from '../../reducers/tree';
import { createPost } from '../../reducers/post';
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
    identificationHelp: false,
    postText: '',
    postTextComplete: false,
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

    const {
      createPostLoading: nextPostLoading,
      createPostError: nextPostError,
      posts: nextPosts,
    } = nextProps.post;
    const { createPostLoading: prevPostLoading, posts: prevPosts } = this.props.post;
    if (
      prevPostLoading
      && !nextPostLoading
      && !nextPostError
      && nextPosts.length
      && nextPosts.length !== prevPosts.length
    ) {
      this.props.navigation.goBack();
      this.props.navigation.navigate({
        routeName: 'PostDetail',
        params: { postId: nextPosts[0].id },
        key: `PostDetail-${nextPosts[0].id}`,
      });
    }
  }

  handleSelectSpecies = (chosenSpecies) => {
    this.setState({ chosenSpecies });
    this.props.navigation.setParams({
      title: chosenSpecies.name,
    });
  }

  createPost = () => {
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

  getTreeForm = () => {
    /* eslint-disable camelcase */
    const { sub: user_id } = this.props.user;
    /* eslint-enable camelcase */
    const longitude = this.props.navigation.getParam('longitude', false);
    const latitude = this.props.navigation.getParam('latitude', false);
    const { images } = this.state;
    return {
      user_id,
      latitude,
      longitude,
      images: images.map(image => {
        return {
          url: image,
          user_id,
        };
      }),
    };

  }

  createPost = () => {
    /* eslint-disable camelcase */
    const { sub: user_id } = this.props.user;
    /* eslint-enable camelcase */
    const { postText } = this.state;
    const treeForm = this.getTreeForm();

    this.props.createPost({
      text: postText,
      user_id,
      tree: treeForm,
    });
  }

  createTree = () => {
    /* eslint-disable camelcase */
    const { sub: user_id } = this.props.user;
    /* eslint-enable camelcase */
    const { chosenSpecies } = this.state;
    const treeForm = this.getTreeForm();

    treeForm.species_votes = [{
      user_id,
      species_id: chosenSpecies.id,
    }];
    this.props.createTree(treeForm);
  }

  render() {
    const {
      images, chosenSpecies, identificationHelp,
      postText, postTextComplete,
    } = this.state;
    const {
      createTreeLoading, createTreeError,
    } = this.props.tree;
    const {
      createPostLoading, createPostError,
    } = this.props.post;
    const {
      generateImageUrlError,
    } = this.props.treeImage;
    let content = null;
    const selectImagesContent = (
      <View>
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
    if (!chosenSpecies && !identificationHelp) {
      content = (
        <ScrollView style={{ padding: 5 }}>
          <View style={{ paddingVertical: 10 }}>
            <Button
              title="select a species"
              onPress={() => this.props.navigation.navigate(
                'SearchSpeciesModal',
                { onSpeciesSelect: this.handleSelectSpecies },
              )}
            />
          </View>
          <View style={{ paddingTop: 10 }}>
            <Button
              title="identification help"
              onPress={() => this.setState({ identificationHelp: true })}
            />
          </View>
        </ScrollView>
      );
    } else if (identificationHelp && !postTextComplete) {
      content = (
        <ScrollView
          style={{ padding: 5 }}
          keyboardShouldPersistTaps="handled"
        >
          <InputText
            onChangeText={(text) => this.setState({ postText: text })}
            value={postText}
            label="Add a title for the post"
            labelStyle={{ textAlign: 'center' }}
            submitDisabled={!postText}
            onSubmit={() => {
              this.setState({ postTextComplete: true });
              this.props.navigation.setParams({
                title: postText,
              });
            }}
          />
        </ScrollView>
      );

    } else if (identificationHelp && postTextComplete) {
      content = (
        <ScrollView style={{ padding: 5 }}>
          {images.length === 0 && (
            <Text style={styles.calloutText}>
              Add a few images to help identify this tree!
            </Text>
          )}
          {selectImagesContent}
        </ScrollView>
      );
    } else {
      content = (
        <ScrollView style={{ padding: 5 }}>
          <View style={{ paddingBottom: 5 }}>
            <Button
              title="select a diffferent species"
              onPress={() => this.props.navigation.navigate(
                'SearchSpeciesModal',
                { onSpeciesSelect: this.handleSelectSpecies },
              )}
            />
          </View>
          {images.length === 0 && (
            <Text style={styles.calloutText}>No images. Why not add one?</Text>
          )}
          {selectImagesContent}
        </ScrollView>
      );

    }
    let addTreeButton = null;
    if (this.state.chosenSpecies) {
      addTreeButton = (
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
      );
    } else if (identificationHelp && images.length === 0) {
      addTreeButton = (
        <View style={styles.createTreeButton}>
          {createPostLoading
            ? <ActivityIndicator size={32} />
            : (
              <Button
                title="create id post"
                onPress={this.createPost}
              />
            )
          }
        </View>
      );
    }

    const longitude = this.props.navigation.getParam('longitude', false);
    const latitude = this.props.navigation.getParam('latitude', false);
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
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
            showsPointsOfInterest={false}
            showsCompass={false}
            showsScale={false}
            showsTraffic={false}
            showsIndoorLevelPicker={false}
            toolbarEnabled={false}
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
        <View style={{ flex: 2 }}>
          {content}
          {addTreeButton}
        </View>
        <View style={styles.tabBarInfoContainer}>
          {createTreeError && <Error message={createTreeError} />}
          {generateImageUrlError && <Error message={generateImageUrlError} />}
          {createPostError && <Error message={createPostError} />}
        </View>
      </View>
    );
  }
}
// TODO: clear generateImageUrlError when you switch between screens
// onPress={() => this.createTree(true)} }

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
  post: PropTypes.shape({
    posts: PropTypes.array,
    createPostLoading: PropTypes.bool,
    createPostError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  navigation: PropTypes.object,
  createTree: PropTypes.func,
  createPost: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    tree: state.tree,
    treeImage: state.treeImage,
    post: state.post,
  };
};

const mapDispatchToProps = {
  createTree,
  createPost,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeForm);
