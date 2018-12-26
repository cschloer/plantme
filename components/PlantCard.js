import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  TouchableOpacity,
} from 'react-native';
import { Card } from 'react-native-elements';


class PlantCard extends React.Component {

  render() {
    const { name, created, id } = this.props.plant;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate(
            'PlantDetail',
            { plantId: id },
          );
        }}
      >
        <Card
          title={name}
        >
          <Text>
            created {created}
          </Text>
        </Card>
      </TouchableOpacity>
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
  navigation: PropTypes.object,
};

export default PlantCard;
