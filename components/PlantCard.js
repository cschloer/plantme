import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Image,
} from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';

import DeleteButton from './DeleteButton';
import { deleteUserPlant } from '../reducers/userPlant';


class PlantCard extends React.Component {

  render() {
    const { name, id, images } = this.props.plant;
    const { deletable } = this.props;
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
          {deletable && (
            <DeleteButton
              deleteFunc={() => this.props.deleteUserPlant(id)}
              alertTitle="delete plant"
              alertText="Are you sure you want to delete this plant?"
            />
          )}
          {(images.length !== 0) && (
            <Image
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: 200,
                height: 200,
              }}
              source={{ uri: images[0].url }}
            />
          )}
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
    images: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string,
    })),
  }),
  navigation: PropTypes.object,
  deletable: PropTypes.bool,
  deleteUserPlant: PropTypes.func,
};

const mapDispatchToProps = {
  deleteUserPlant,
};

export default connect(null, mapDispatchToProps)(PlantCard);
