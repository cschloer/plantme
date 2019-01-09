import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import {
  ListItem, Text,
} from 'react-native-elements';

import Error from '../../components/Error';
import Carousel from '../../components/Carousel';
import UploadImage from '../../components/UploadImage';
import SpeciesListItem from '../../components/SpeciesListItem';

import { createTreeImage } from '../../reducers/treeImage';
import {
  createTreeSpeciesVote,
  updateTreeSpeciesVote,
} from '../../reducers/treeSpeciesVote';
import { styles } from '../styles';

class TreeDetail extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: `${state.params.title}`,
    };
  };

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
    this.props.navigation.setParams({
      title: tree.species_votes.length
        ? tree.species_votes[0][0].species.name : 'Unknown species',
    });
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
      this.props.navigation.setParams({
        title: tree.species_votes.length
          ? tree.species_votes[0][0].species.name : 'Unknown species',
      });
      this.setState({ tree });
    }
  }

  handleVote = (speciesId) => {
    console.log('HANDLING A SPECIES');
    const { tree } = this.state;
    const { sub: userId } = this.props.user;
    const prevVote = tree.species_votes.reduce((acc1, voteTally) => (
      acc1 || voteTally.reduce((acc2, vote) => {
        if (vote.user_id === userId) {
          return vote;
        }
        return acc2;
      }, null)
    ), null);
    if (prevVote) {
      this.props.updateTreeSpeciesVote(speciesId, prevVote.id);
    } else {
      this.props.createTreeSpeciesVote(tree.id, userId, speciesId);
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
    return (
      <View style={styles.container}>
        <ScrollView>
          <Carousel
            images={images.map(image => image.url)}
          />
          {!images.length && (
            <Text style={{ textAlign: 'center', paddingTop: 3 }}>Upload a photo!</Text>
          )}
          <UploadImage
            onImageUpload={this.addNewImage}
            size={32}
            otherLoading={createTreeImageLoading}
            topRight={images.length !== 0}
          />
          <FlatList
            data={speciesVotes.map(
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
                <SpeciesListItem
                  species={voteTally[0].species}
                  subtitle={text}
                  leftIcon={{
                    name: 'tree',
                    color: userVoted ? 'green' : 'black',
                    type: 'font-awesome',
                  }}
                  onPress={userVoted || !this.props.user.sub
                    ? null : () => this.handleVote(voteTally[0].species_id)
                  }
                  navigation={this.props.navigation}
                />
              );

            }}
          />
          <ListItem
            title="Vote for a new species"
            leftIcon={{
              name: 'question',
              type: 'font-awesome',
            }}
            onPress={() => this.props.navigation.navigate(
              'SearchSpeciesModal',
              { onSpeciesSelect: (speciesId) => this.handleVote(speciesId) },
            )}
          />
          <View style={styles.tabBarInfoContainer}>
            {generateImageUrlError && <Error message={generateImageUrlError} />}
          </View>
        </ScrollView>
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
  createTreeSpeciesVote: PropTypes.func,
  updateTreeSpeciesVote: PropTypes.func,
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
  createTreeSpeciesVote,
  updateTreeSpeciesVote,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeDetail);
