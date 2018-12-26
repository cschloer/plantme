import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';

import Loading from '../../components/Loading';
import { getSingleUserPlant } from '../../reducers/user_plant';
import { styles } from '../styles';

class PlantDetail extends React.Component {

  componentDidMount() {
    const { getSingleUserPlant, navigation } = this.props;
    const plantId = navigation.getParam('plantId', false);
    if (plantId) {
      getSingleUserPlant(plantId);
    } else {
      // TODO error
    }
  }

  render() {
    const { singlePlant, singlePlantLoading, singlePlantError } = this.props.userPlant;
    console.log('Userplant', this.props)
    if (singlePlantError) {
      // TODO error
    } else if (singlePlantLoading) {
      return (
        <Loading />
      );
    }
    const { created, id, name } = singlePlant;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text>hello! {id} ---</Text>
        </ScrollView>
      </View>
    );
  }

}

PlantDetail.propTypes = {
  navigation: PropTypes.object,
  getSingleUserPlant: PropTypes.func,
  userPlant: PropTypes.shape({
    singlePlant: PropTypes.shape({
      created: PropTypes.string,
      id: PropTypes.number,
      name: PropTypes.string,
      user_id: PropTypes.string,
    }),
    singlePlantLoading: false,
    singlePlantError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
};

const mapStateToProps = state => {
  return {
    userPlant: state.userPlant,
  };
};

const mapDispatchToProps = {
  getSingleUserPlant,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlantDetail);
