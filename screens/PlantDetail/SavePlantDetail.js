import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'expo';
import { connect } from 'react-redux';

import { updateUserPlant } from '../../reducers/userPlant';

class SavePlantDetail extends React.Component {

  render() {
    const { plantId, form } = this.props;
    const { updatePlantLoading } = this.props.userPlant;
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.updateUserPlant(plantId, form);
        }}
        style={{ marginRight: 8 }}
      >
        {updatePlantLoading
          ? <ActivityIndicator size={32} />
          : (
            <Icon.Feather
              name="save"
              size={32}
              color="green"
            />
          )
        }
      </TouchableOpacity>
    );
  }
}

SavePlantDetail.propTypes = {
  updateUserPlant: PropTypes.func,
  form: PropTypes.object,
  plantId: PropTypes.number,
  userPlant: PropTypes.shape({
    updatePlantLoading: PropTypes.bool,
    updatePlantError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
};

const mapStateToProps = state => {
  return {
    userPlant: state.userPlant,
  };
};

const mapDispatchToProps = {
  updateUserPlant,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavePlantDetail);
