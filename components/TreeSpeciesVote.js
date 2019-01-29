import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
} from 'react-native';
import {
  ListItem,
} from 'react-native-elements';

import SpeciesListItem from './SpeciesListItem';
import Error from './Error';
import Loading from './Loading';

import {
  createTreeSpeciesVote,
  updateTreeSpeciesVote,
} from '../reducers/treeSpeciesVote';
import { styles } from '../screens/styles';

class TreeSpeciesVote extends React.Component {

  state = {
    tree: null,
  };

  componentDidMount() {
    const { treeId } = this.props;
    if (treeId) {
      const tree = this.props.tree.trees.reduce((acc, treeObj) => {
        if (!acc && treeObj.id === treeId) {
          return treeObj;
        }
        return acc;

      }, null);
      this.setState({ tree });
    } else {
      const { treeObj } = this.props;
      this.setState({ tree: treeObj });
    }

  }

  componentWillReceiveProps(nextProps) {
    const { treeId } = this.props;
    if (treeId) {
      const { trees: nextTrees } = nextProps.tree;
      const { trees: prevTrees } = this.props.tree;
      if (nextTrees !== prevTrees) {
        const tree = nextProps.tree.trees.reduce((acc, treeObj) => {
          if (!acc && treeObj.id === treeId) {
            return treeObj;
          }
          return acc;

        }, null);
        this.setState({ tree });
      }
    } else if (nextProps.treeObj !== this.props.treeObj) {
      this.setState({ tree: nextProps.treeObj });
    }
  }

  handleVote = (speciesId) => {
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

  render() {
    const {
      createTreeSpeciesVoteError,
      updateTreeSpeciesVoteError,
    } = this.props.treeSpeciesVote;
    if (!this.state.tree) {
      return <Loading />;
    }
    const {
      species_votes: speciesVotes,
    } = this.state.tree;

    return (
      <View>
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
        {this.props.user.sub && (
          <ListItem
            topDivider
            title="Vote for a new species"
            leftIcon={{
              name: 'question',
              type: 'font-awesome',
            }}
            onPress={() => this.props.navigation.navigate(
              'SearchSpeciesModal',
              { onSpeciesSelect: (species) => this.handleVote(species.id) },
            )}
          />
        )}
        <View style={styles.tabBarInfoContainer}>
          {createTreeSpeciesVoteError && <Error message={createTreeSpeciesVoteError} />}
          {updateTreeSpeciesVoteError && <Error message={updateTreeSpeciesVoteError} />}
        </View>
      </View>
    );
  }
}

const requiredPropsCheck = (props, propName, componentName) => {
  if (!props.treeObj && !props.treeId) {
    return new Error(`One of 'treeObj' or 'treeId' is required by '${componentName}' component.`);
  }
  return null;
};

TreeSpeciesVote.propTypes = {
  // treeObj can either be passed in manually, or a treeId can be passed
  treeObj: requiredPropsCheck,
  treeId: requiredPropsCheck,
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  tree: PropTypes.shape({
    trees: PropTypes.array,
  }),
  treeSpeciesVote: PropTypes.shape({
    createTreeSpeciesVoteLoading: PropTypes.bool,
    createTreeSpeciesVoteError: PropTypes.bool,
    updateTreeSpeciesVoteLoading: PropTypes.bool,
    updateTreeSpeciesVoteError: PropTypes.bool,
  }),
  navigation: PropTypes.object,
  createTreeSpeciesVote: PropTypes.func,
  updateTreeSpeciesVote: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    species: state.species,
    tree: state.tree,
    treeSpeciesVote: state.treeSpeciesVote,
  };
};

const mapDispatchToProps = {
  createTreeSpeciesVote,
  updateTreeSpeciesVote,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeSpeciesVote);
