import React from 'react';
import PropTypes from 'prop-types';
import {
  View, ScrollView,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { ListItem, Text, Divider } from 'react-native-elements';

import { styles } from '../styles';
import { getSinglePost, createPostComment } from '../../reducers/post';
import Error from '../../components/Error';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import InputText from '../../components/InputText';
import TreeSpeciesVote from '../../components/TreeSpeciesVote';
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
    newCommentText: '',
  };

  componentDidMount() {
    const postId = this.props.navigation.getParam('postId', false);
    const { posts } = this.props.post;
    if (posts) {
      console.log('Calling get posts object', postId);
      const post = this.getPostObject(postId, posts);
      if (post) {
        this.setState({ post });
        this.props.navigation.setParams({
          user: post.user_name,
        });
      } else {
        this.props.getSinglePost(postId);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextPostId = nextProps.navigation.getParam('postId', null);
    const oldPostId = this.props.navigation.getParam('postId', null);
    const { post: currentPost } = this.state;
    const {
      posts: nextPosts,
      singlePost: nextSinglePost,
    } = nextProps.post;
    const {
      posts: prevPosts,
      singlePost: prevSinglePost,
    } = this.props.post;
    let post = null;
    if (nextPostId !== oldPostId) {
      // Handle the case where the id has changed
      post = this.getPostObject(nextPostId, nextPosts);
      if (!post) {
        this.setState({ post });
        this.props.navigation.setParams({ user: null });
        this.props.getSinglePost(nextPostId);
      }
    } else if (nextSinglePost && nextSinglePost.id === nextPostId) {
    // Handle the case where the singlePost has this postId
      if (nextSinglePost !== prevSinglePost || !currentPost) {
        post = nextSinglePost;
      }
    } else if (nextPosts && nextPosts !== prevPosts) {
      // Hande the case where we get the post from the big list of posts
      post = this.getPostObject(nextPostId, nextPosts);
      if (!post && (!currentPost || currentPost.id !== nextPostId)) {
        // A post that doesn't exist in the big list
        this.setState({ post });
        this.props.navigation.setParams({ user: null });
        this.props.getSinglePost(nextPostId);
      }
    }
    if (post) {
      this.setState((prevState) => {
        return {
          newCommentText: (!currentPost || post.comments.length !== post.comments)
            ? '' : prevState.newCommentText,
          post,
        };
      });
      this.props.navigation.setParams({
        user: post.user_name || 'undefined',
      });
    }
  }

  getPostObject = (postId, nextPosts) => {
    const post = nextPosts.reduce((acc, postObj) => {
      if (!acc && postObj.id === postId) {
        return postObj;
      }
      return acc;
    }, null);
    return post;
  }

  navigateToTree = () => {
    const { tree } = this.state.post;
    const { latitude, longitude } = tree;
    this.props.navigation.navigate({
      routeName: 'Map',
      params: { latitude, longitude },
    });
  }

  render() {
    const {
      createPostCommentLoading, createPostCommentError,
      getSinglePostLoading, getPostsLoading,
    } = this.props.post;
    const { post, newCommentText } = this.state;
    console.log(getSinglePostLoading, getPostsLoading);

    let content = null;
    if (!post && (getPostsLoading || getSinglePostLoading)) {
      content = <Loading />;
    } else if (!post) {
      content = <Error />;
    } else {
      content = (
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="handled"
          resetScrollToCoords={{ x: 0, y: 0 }}
        >
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
          <View style={{ marginVertical: 10 }}>
            {!post.comments.length && (
              <Text style={{ textAlign: 'center', paddingVertical: 10 }}>No comments</Text>
            )}
            {post.comments.map((comment, i) => (
              <View key={i}>
                <Comment comment={comment} />
              </View>
            ))}
            {this.props.user.sub && (
              <View style={{ padding: 5, paddingTop: 10 }}>
                <InputText
                  multiline
                  onChangeText={(text) => this.setState({ newCommentText: text })}
                  value={newCommentText}
                  label="add a new comment"
                  onSubmit={() => {
                    this.props.createPostComment(post.id, this.props.user.sub, newCommentText);
                    Keyboard.dismiss();
                  }}
                  submitDisabled={!newCommentText}
                  submitLoading={createPostCommentLoading}
                  iconName="comment-plus-outline"
                />
              </View>
            )}
          </View>
          <View style={{ paddingTop: 5 }}>
            <TreeSpeciesVote
              treeId={post.tree.id}
              navigation={this.props.navigation}
            />
            <ListItem
              bottomDivider
              topDivider
              title="View tree on map"
              leftIcon={{
                name: 'map',
                type: 'material-icons',
              }}
              onPress={this.navigateToTree}
            />
          </View>
          <View style={styles.tabBarInfoContainer}>
            {createPostCommentError && <Error message={createPostCommentError} />}
          </View>
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
  getSinglePost: PropTypes.func,
  post: PropTypes.shape({
    createPostCommentLoading: PropTypes.bool,
    createPostCommentError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    getPostsLoading: PropTypes.bool,
    posts: PropTypes.array,
    singlePost: PropTypes.object,
    getSinglePostLoading: PropTypes.bool,
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
    user: state.login.profile,
  };
};

const mapDispatchToProps = {
  createPostComment,
  getSinglePost,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
