import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ScrollView, RefreshControl,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import Error from '../../components/Error';

import { getPosts } from '../../reducers/post';
import { styles } from '../styles';

class Posts extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
  };

  componentDidMount = () => {
    this.getPosts();
  }


  getPosts = () => {
    this.props.getPosts(20);
  }

  render() {
    const { posts, getPostsLoading, getPostsError } = this.props.post;
    let content = null;
    if (getPostsError) {
      content = <Error message={getPostsError} />;
    } else {
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
            'PostDetail',
            { postId: post.id },
          )}
          title={post.text}
          titleProps={{ numberOfLines: 1 }}
          subtitle={`${post.comments.length} comment${post.comments.length !== 1 ? 's' : ''}`}
          topDivider
          bottomDivider
        />
      ));
    }
    return (
      <ScrollView
        style={styles.container}
        refreshControl={(
          <RefreshControl
            refreshing={getPostsLoading}
            onRefresh={this.getPosts}
          />
        )}
      >
        {content}
      </ScrollView>
    );
  }
}

Posts.propTypes = {
  post: PropTypes.shape({
    posts: PropTypes.array,
    getPostsLoading: PropTypes.bool,
    getPostsError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  getPosts: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    post: state.post,
  };
};

const mapDispatchToProps = {
  getPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
