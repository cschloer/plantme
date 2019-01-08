import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
} from 'react-native';
import {
  Divider,
  Text,
  ListItem,
} from 'react-native-elements';

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
        <FlatList
          data={tree.species_votes.map(
            (item, index) => { return { data: item, key: index.toString() }; }
          )}
          renderItem={({ item }) => {
            const voteTally = item.data;
            const userVoted = voteTally.reduce((acc, vote) => (
              acc || vote.user_id === this.props.user.sub
            ), false);
            let text = `${voteTally.length} vote${voteTally.length > 1 ? 's' : ''}`;
            if (userVoted) {
              text = `${text}, including you`;
            }
            return (
              <View>
                <Divider />
                <ListItem
                  title={voteTally[0].species.name}
                  subtitle={text}
                  leftIcon={{
                    name: 'tree',
                    color: userVoted ? 'green' : 'black',
                    type: 'font-awesome',
                  }}
                />
              </View>
            );

          }}
        />
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
