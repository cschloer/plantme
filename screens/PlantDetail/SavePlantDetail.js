import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';

import { updateUserPlant } from '../../reducers/user_plant';

class SavePlantDetail extends React.Component {

  // Render any loading content that you like here
  render() {
    const { updatePlantLoading } = this.props.userPlant;
    if (updatePlantLoading) {
      return (
        <Button
          loading
          loadingProps={{ size: 'large', color: 'rgba(111, 202, 186, 1)' }}
          titleStyle={{ fontWeight: '700' }}
          buttonStyle={{
            width: 300,
            height: 45,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 5,
          }}
        />
      );

    }
    const { plantId, form } = this.props;
    return (
      <Button
        buttonStyle={{
          width: 300,
          height: 45,
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 5,
        }}
        titleStyle={{ fontWeight: '700' }}
        title="save"
        onPress={() => {
          this.props.updateUserPlant(plantId, form);
        }}
      />
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
