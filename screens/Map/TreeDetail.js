import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Icon } from 'expo';
import {
  View,
} from 'react-native';
import { Divider, Text } from 'react-native-elements';

import Error from '../../components/Error';
import Carousel from '../../components/Carousel';
import UploadImage from '../../components/UploadImage';

import { createTreeImage } from '../../reducers/treeImage';
import { styles } from '../styles';

class TreeDetail extends React.Component {

  state = {
    tree: null,
  }

  componentDidMount() {
    const treeId = this.props.navigation.getParam('treeId', null);
    const tree = this.props.tree.trees.reduce((acc, treeObj) => {
      if (!acc && treeObj.id === treeId) {
        return treeObj;
      }
      return acc;

    }, null);
    this.setState({ tree });

  }

  componentWillReceiveProps(nextProps) {
    const { trees: nextTrees } = nextProps.tree;
    const { trees: prevTrees } = this.props.tree;
    if (nextTrees !== prevTrees) {
      const treeId = this.props.navigation.getParam('treeId', null);
      const tree = nextProps.tree.trees.reduce((acc, treeObj) => {
        if (!acc && treeObj.id === treeId) {
          return treeObj;
        }
        return acc;

      }, null);
      this.setState({ tree });
    }
  }


  addNewImage = (imageUrl) => {
    const treeId = this.props.navigation.getParam('treeId', null);
    const { sub: userId } = this.props.user;
    this.props.createTreeImage(treeId, userId, imageUrl);
  }

  render() {
    const { tree } = this.state;
    const { createTreeImageLoading, generateImageUrlError } = this.props.treeImage;
    if (!tree) {
      return <Error />;
    }
    const { species_votes: speciesVotes, images } = tree;
    let species = {
      name: 'Unknown species',
      description: 'Can you help identify this species?',
    };
    if (speciesVotes.length > 0) {
      // TODO: make sure either here or backend that it has th most votes
      ([[{ species }]] = tree.species_votes);
    }
    return (
      <View style={styles.container}>
        <Text h4 style={{ textAlign: 'center' }}>{species.name}</Text>
        <Divider />
        <Carousel
          images={images.map(image => image.url)}
        />
        <View>
          <Text style={{ textAlign: 'center' }}>Add a photo of this tree</Text>
          <UploadImage
            onImageUpload={this.addNewImage}
            size={32}
            otherLoading={createTreeImageLoading}
          />
        </View>
        <View style={styles.tabBarInfoContainer}>
          {generateImageUrlError && <Error message={generateImageUrlError} />}
        </View>
        <Divider />
        <View style={{ paddingTop: 10 }}>
          {tree.species_votes.map((voteTally, i) => {
            const userVoted = voteTally.reduce((acc, vote) => (
              acc || vote.user_id === this.props.user.sub
            ), false);
            let text = '';
            if (userVoted) {
              if (voteTally.length > 1) {
                text = `You and ${voteTally.length - 1} other ${voteTally.length > 2 ? 'people' : 'person'} think this is a ${voteTally[0].species.name}`;
              } else {
                text = `You think this is a ${voteTally[0].species.name}`;
              }
            } else {
              text = `${voteTally.length} ${voteTally.length > 1 ? 'people think' : 'person thinks'} this is a ${voteTally[0].species.name}`;
            }
            return (
              <View style={{ flexDirection: 'row', paddingTop: 5 }} key={i}>
                <Icon.FontAwesome
                  name="tree"
                  size={32}
                  color={userVoted ? 'green' : 'black'}
                />
                <Text>{text}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
}

TreeDetail.propTypes = {
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
    trees: PropTypes.array,
  }),
  treeImage: PropTypes.shape({
    createTreeImageLoading: PropTypes.bool,
    createTreeImageError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    generateImageUrlError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  navigation: PropTypes.object,
  createTreeImage: PropTypes.func,
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
  createTreeImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeDetail);
