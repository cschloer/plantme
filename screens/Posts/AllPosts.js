import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Posts from './Posts';
import { getPosts } from '../../reducers/post';

class AllPosts extends React.Component {
  static navigationOptions = {
    header: null,
  };

  getPosts = () => {
    this.props.getPosts({ limit: 20 });
  }

  render() {
    const {
      navigation,
    } = this.props;
    const {
      getPostsLoading,
      getPostsError,
      posts,
    } = this.props.post;
    return (
      <Posts
        getPosts={this.getPosts}
        posts={posts}
        getPostsError={getPostsError}
        getPostsLoading={getPostsLoading}
        postDetailRouteName="AllPostDetail"
        navigation={navigation}
      />
    );
  }
}

AllPosts.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts);
