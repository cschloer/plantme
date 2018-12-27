import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'expo';
import { Text, Input, Button } from 'react-native-elements';

import Loading from '../../components/Loading';
import Error from '../../components/Error';
import { getSingleUserPlant } from '../../reducers/user_plant';
import { styles } from '../styles';

class PlantDetail extends React.Component {

  state = {
    editMode: false,
    form: {},
  };

  componentDidMount() {
    const plantId = this.props.navigation.getParam('plantId', false);
    if (plantId) {
      this.props.getSingleUserPlant(plantId);
    } else {
      // TODO error
    }
  }

  render() {
    const { navigation, userPlant } = this.props;
    const { singlePlant, singlePlantLoading, singlePlantError } = userPlant;
    const plantId = navigation.getParam('plantId', false);

    if (singlePlantError || !plantId) {
      return (
        <Error message={singlePlantError} />
      );
    }
    if (singlePlantLoading) {
      return (
        <Loading />
      );
    }
    const { created, id, name } = singlePlant;

    const { editMode } = this.state;

    const editButton = (
      <TouchableOpacity
        style={styles.editSymbol}
        onPress={() => {
          this.setState({
            editMode: !editMode,
            form: {
              name,
            },
          });
        }}
      >
        <Icon.Feather
          name={editMode ? 'x' : 'edit-2'}
          size={32}
        />
      </TouchableOpacity>
    )

    if (editMode) {
      const { form } = this.state;
      return (
        <View style={styles.container}>
          {editButton}
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.secondPageContentContainer}
          >
            <Input
              value={form.name}
              onChangeText={(text) => this.setState(
                { form: { ...form, name: text } }
              )}
              inputStyle={styles.h1Form}
              label="name"
            />
            <Text>Created {created}</Text>
          </ScrollView>
          <View style={styles.tabBarInfoContainer}>
            <Button
              containerStyle={{ width: '100%', marginLeft: 0 }}
              title="save"
              onPress={() => console.log('pressed')}
              raised={false}
            />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {editButton}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.secondPageContentContainer}
        >
          <Text h1>{name}</Text>
          <Text>Created {created}</Text>
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
