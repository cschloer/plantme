import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';
import { Text, Card } from 'react-native-elements';


class Comment extends React.Component {

  dateAgeDays = (date) => {
    return Math.round(
      (new Date() - date) / (1000 * 60 * 60 * 24)
    );
  }

  render() {
    const { comment } = this.props;
    const commentAge = this.dateAgeDays(new Date(comment.created));
    return (
      <View>
        <Card>
          <Text
            style={{ color: 'gray', left: 0 }}
          >
            {commentAge > 0
              ? `${comment.user_name} ${commentAge} day${commentAge > 1 ? 's' : ''} ago`
              : `${comment.user_name} today`
            }
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
