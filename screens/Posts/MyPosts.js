import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Posts from './Posts';
import { getUserPosts } from '../../reducers/post';

class MyPosts extends React.Component {
  static navigationOptions = {
    header: null,
  };


  getPosts = () => {
    this.props.getUserPosts(this.props.user.sub, { limit: 20 });
  }

  render() {
    const {
      navigation,
    } = this.props;
    const {
      getUserPostsLoading,
      getUserPostsError,
      userPosts,
    } = this.props.post;
    return (
      <Posts
        key="MyPosts"
        getPosts={this.getPosts}
        posts={userPosts}
        getPostsError={getUserPostsError}
        getPostsLoading={getUserPostsLoading}
        navigation={navigation}
      />
    );
  }
}

MyPosts.propTypes = {
  post: PropTypes.shape({
    userPosts: PropTypes.array,
    getUserPostsLoading: PropTypes.bool,
    getUserPostsError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  getUserPosts: PropTypes.func,
  navigation: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    post: state.post,
    user: state.login.profile,
  };
};

const mapDispatchToProps = {
  getUserPosts,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPosts);
