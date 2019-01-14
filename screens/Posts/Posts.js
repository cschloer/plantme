import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View, ScrollView,
} from 'react-native';
import { Card, Text } from 'react-native-elements';
import Loading from '../../components/Loading';
import Error from '../../components/Error';

import { getPosts } from '../../reducers/post';
import { styles } from '../styles';

class Posts extends React.Component {
  static navigationOptions = {
    title: 'Tree Identification Help',
  };

  componentDidMount = () => {
    this.props.getPosts();
  }


  render() {
    const { posts, getPostsLoading, getPostsError } = this.props.post;
    if (getPostsError) {
      return (
        <Error message={getPostsError} />
      );
    }
    if (getPostsLoading) {
      return (
        <Loading />
      );
    }
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {
          posts.map((post, i) => (
            <Card key={i}>
              <View>
                <Text h4>{post.text}</Text>
                {post.comments.map((comment, i2) => (
                  <Text key={i2}>
                    {comment.text}
                  </Text>
                ))}
              </View>
            </Card>
          ))
        }
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
