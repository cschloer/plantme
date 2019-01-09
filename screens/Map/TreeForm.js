import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  Button,
  Picker,
  ActivityIndicator,
} from 'react-native';

import { Divider, Text } from 'react-native-elements';

import Error from '../../components/Error';
import Loading from '../../components/Loading';
import UploadImage from '../../components/UploadImage';
import Carousel from '../../components/Carousel';

import { getSpecies } from '../../reducers/species';
import { createTree } from '../../reducers/tree';
import { styles } from '../styles';

class TreeForm extends React.Component {
  static navigationOptions = {
    title: 'add a tree',
  };

  state = {
    chosenSpecies: {},
    images: [],
  }

  componentDidMount() {
    const { speciesList, speciesLoading } = this.props.species;
    if (!speciesLoading) {
      if (speciesList.length === 0) {
        this.props.getSpecies();
      } else {
        this.setState({ chosenSpecies: speciesList[0] });
      }
    }
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
      speciesLoading: nextSpeciesLoading,
      speciesError: nextSpeciesError,
      speciesList,
    } = nextProps.species;
    const { speciesLoading: prevSpeciesLoading } = this.props.species;
    if (
      prevSpeciesLoading && !nextSpeciesLoading && !nextSpeciesError
      && speciesList.length > 0
    ) {
      this.setState({ chosenSpecies: speciesList[0] });
    }
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
    const { images } = this.state;
    const {
      speciesList, speciesLoading, speciesError,
    } = this.props.species;
    const {
      createTreeLoading, createTreeError,
    } = this.props.tree;
    const {
      generateImageUrlError,
    } = this.props.treeImage;
    if (speciesError) {
      return <Error message={speciesError} />;
    }
    return (
      <View style={styles.container}>
        {speciesLoading
          ? <Loading />
          : (
            <Picker
              selectedValue={this.state.chosenSpecies.id}
              onValueChange={(chosenValue) => {
                const species = speciesList.reduce((acc, speciesDict) => {
                  if (!acc && speciesDict.id === chosenValue) {
                    return speciesDict;
                  }
                  return acc;
                }, null);
                this.setState({ chosenSpecies: species });
              }}
              prompt="Select a species"
            >
              {speciesList.map(speciesDict => (
                <Picker.Item
                  key={speciesDict.id}
                  label={speciesDict.name}
                  value={speciesDict.id}
                />
              ))}
            </Picker>
          )
        }
        <Divider />
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
          size={32}
        />
        {this.state.chosenSpecies.id && (
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
  species: PropTypes.shape({
    speciesLoading: PropTypes.bool,
    speciesError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    speciesList: PropTypes.array,
  }),
  tree: PropTypes.shape({
    createTreeLoading: PropTypes.bool,
    createTreeError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  treeImage: PropTypes.shape({
    generateImageUrlError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  navigation: PropTypes.object,
  getSpecies: PropTypes.func,
  createTree: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    species: state.species,
    tree: state.tree,
    treeImage: state.treeImage,
  };
};

const mapDispatchToProps = {
  getSpecies,
  createTree,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeForm);
