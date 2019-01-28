import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import { Text, Card } from 'react-native-elements';
import { getDayAgeString } from './Posts';

class Comment extends React.Component {


  render() {
    const { comment } = this.props;
    return (
      <View>
        <Card containerStyle={{ marginVertical: 10 }}>
          <Text
            style={{ color: 'gray', left: 0 }}
          >
            {`${comment.user_name}, ${getDayAgeString(comment.created)}`}
          </Text>
          <Text style={{ fontSize: 16 }}>
            {comment.text}
          </Text>
        </Card>
      </View>
    );
  }

}

Comment.propTypes = {
  comment: PropTypes.shape({
    created: PropTypes.string,
    id: PropTypes.number,
    text: PropTypes.string,
    user_name: PropTypes.string,
  }),
};

export default Comment;
