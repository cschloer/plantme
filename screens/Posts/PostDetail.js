import React from 'react';
import PropTypes from 'prop-types';
import {
  View, ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { Text, Divider } from 'react-native-elements';

import { styles } from '../styles';
import { createPostComment } from '../../reducers/post';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import Comment from './Comment';

class PostDetail extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const title = state.params.user
      ? `Post created by ${state.params.user}`
      : '';
    return {
      title,
    };
  };

  state = {
    post: null,
    findPostError: false,
  };

  componentDidMount() {
    const postId = this.props.navigation.getParam('postId', false);
    const { posts } = this.props.post;
    const post = posts.reduce((acc, postObj) => {
      if (!acc && postObj.id === postId) {
        return postObj;
      }
      return acc;
    }, null);
    if (post) {
      this.setState({ post });
      this.props.navigation.setParams({
        user: post.user_name || 'undefined',
      });
    } else {
      this.setState({ findPostError: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { posts: nextPosts } = nextProps.post;
    const { posts: prevPosts } = this.props.post;
    if (nextPosts !== prevPosts) {
      const postId = this.props.navigation.getParam('postId', null);
      const post = nextPosts.reduce((acc, postObj) => {
        if (!acc && postObj.id === postId) {
          return postObj;
        }
        return acc;
      }, null);
      this.setState({ post });
      this.props.navigation.setParams({
        user: post.user_name || 'undefined',
      });
    }

  }

  render() {
    const { navigation } = this.props;
    const {
      createPostCommentLoading, createPostCommentError,
    } = this.props.post;
    const { post, findPostError } = this.state;

    const postId = navigation.getParam('postId', false);

    let content = null;
    if (createPostCommentError) {
      content = <Error message={createPostCommentError} />;
    } else if (!postId || findPostError) {
      content = <Error />;
    } else if (createPostCommentLoading || !post) {
      content = <Loading />;
    } else {
      content = (
        <ScrollView style={styles.container}>
          <View style={{ padding: 5 }}>
            <Text
              style={{
                textAlign: 'center',
                padding: 5,
                fontSize: 16,
              }}
            >
              {post.text}
            </Text>
            <Carousel
              images={post.tree.images.map(image => image.url)}
              size="small"
            />
          </View>
          <Divider />
          {!post.comments.length && (
            <Text style={styles.calloutText}>
              No comments. Why not add one?
            </Text>
          )}
          {post.comments.map((comment, i) => (
            <View key={i}>
              <Comment comment={comment} />
            </View>
          ))}
        </ScrollView>
      );
    }
    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }

}

PostDetail.propTypes = {
  createPostComment: PropTypes.func,
  post: PropTypes.shape({
    createPostCommentLoading: PropTypes.bool,
    createPostCommentError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    posts: PropTypes.array,
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  navigation: PropTypes.object,
};

const mapStateToProps = state => {
  return {
    post: state.post,
  };
};

const mapDispatchToProps = {
  createPostComment,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
