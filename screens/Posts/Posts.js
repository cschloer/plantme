import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView, RefreshControl,
  View,
} from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import Error from '../../components/Error';
import { styles } from '../styles';

export const getDayAgeString = (date) => {
  const numDays = Math.round(
    (new Date() - new Date(date)) / (1000 * 60 * 60 * 24)
  );
  if (numDays === 0) {
    return 'Today';
  }
  if (numDays === 1) {
    return 'Yesterday';
  }
  return `${numDays} days ago`;
};

class Posts extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
  };

  componentDidMount = () => {
    this.props.getPosts();
  }

  render() {
    const {
      posts,
      getPostsLoading,
      getPostsError,
      postDetailRouteName,
    } = this.props;
    let content = null;
    if (getPostsError) {
      content = <Error message={getPostsError} />;
    } else if (posts) {
      content = posts.map((post, i) => (
        <ListItem
          key={i}
          leftAvatar={post.tree.images.length
            ? {
              source: { uri: post.tree.images.length && post.tree.images[0].url },
              rounded: false,
              size: 60,
            } : null
          }
          onPress={() => this.props.navigation.navigate(
            postDetailRouteName,
            { postId: post.id },
          )}
          title={post.text}
          titleProps={{ numberOfLines: 1 }}
          subtitle={getDayAgeString(post.created)}
          rightSubtitle={`${post.comments.length} comment${post.comments.length !== 1 ? 's' : ''}`}
          topDivider
          bottomDivider
        />
      ));
    }
    return (
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={getPostsLoading}
            onRefresh={this.props.getPosts}
          />
        )}
      >
        {posts && !posts.length && !getPostsLoading && (
          <View style={{ padding: 5, paddingTop: 15 }}>
            <Text style={styles.calloutText}>
              There are no posts here
            </Text>
          </View>
        )}
        {content}
      </ScrollView>
    );
  }
}

Posts.propTypes = {
  posts: PropTypes.array,
  postDetailRouteName: PropTypes.string,
  getPostsLoading: PropTypes.bool,
  getPostsError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  getPosts: PropTypes.func,
  navigation: PropTypes.object,
};

export default Posts;
