import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
} from 'react-native';
import { Card } from 'react-native-elements';


class PlantCard extends React.Component {

  render() {
    const { name, created } = this.props.plant;
    return (
      <Card
        title={name}
      >
        <Text>
          created {created}
        </Text>
      </Card>
    );
  }

}

PlantCard.propTypes = {
  plant: PropTypes.shape({
    created: PropTypes.string,
    id: PropTypes.number,
    name: PropTypes.string,
    user_id: PropTypes.string,
  }),
};

export default PlantCard;
