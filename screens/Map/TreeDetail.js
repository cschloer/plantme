import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text, ListItem,
} from 'react-native-elements';

import Error from '../../components/Error';
import Carousel from '../../components/Carousel';
import UploadImage from '../../components/UploadImage';
import TreeSpeciesVote from '../../components/TreeSpeciesVote';

import { createTreeImage } from '../../reducers/treeImage';
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
    const { images } = tree;
    return (
      <View style={styles.container}>
        <View style={{ paddingTop: 5 }}>
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
        </View>
        <ScrollView>
          <TreeSpeciesVote
            treeObj={tree}
            navigation={this.props.navigation}
          />
          {tree.posts.length && (
            <ListItem
              bottomDivider
              topDivider
              title="View identification post"
              leftIcon={{
                name: 'comment-question-outline',
                type: 'material-community',
              }}
              onPress={() => {
                this.props.navigation.navigate(
                  'AllPostDetail',
                  { postId: tree.posts[0].id },
                )
              }}
            />
          )}
        </ScrollView>
        <View style={styles.tabBarInfoContainer}>
          {generateImageUrlError && <Error message={generateImageUrlError} />}
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
    tree: state.tree,
    treeImage: state.treeImage,
  };
};

const mapDispatchToProps = {
  createTreeImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeDetail);
