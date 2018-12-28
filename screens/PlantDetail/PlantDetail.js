import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'expo';
import { Divider, Text, Input } from 'react-native-elements';

import Loading from '../../components/Loading';
import Error from '../../components/Error';
import SavePlantDetail from './SavePlantDetail';
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

  componentWillReceiveProps(nextProps) {
    const {
      updatePlantLoading: nextLoading,
      updatePlantError: nextError,
    } = nextProps.userPlant;
    const { updatePlantLoading: prevLoading } = this.props.userPlant;
    if (prevLoading && !nextLoading && !nextError) {
      this.setState({ editMode: false });
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
    const {
      created,
      id,
      name,
      images = [],
    } = singlePlant;

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
    );

    const imageGroup = images.map((image, i) => (
      <View key={i}>
        <Divider style={styles.divider} />
        <Image
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 200,
            height: 200,
          }}
          source={{ uri: image.url }}
        />
      </View>
    ));

    if (editMode) {
      const { form } = this.state;
      const { updatePlantLoading, updatePlantError } = userPlant;
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
              editable={!updatePlantLoading}
            />
            <Text styles={styles.listText}>created {created}</Text>
            <View style={styles.imageGroupView}>
              <Divider style={styles.divider} />
              <TouchableOpacity
                style={styles.addSymbol}
                onPress={() => {
                  console.log('Add picture resed');
                }}
              >
                <Icon.Feather
                  name="plus"
                  size={64}
                />
              </TouchableOpacity>
              {imageGroup}
            </View>
          </ScrollView>
          {updatePlantError && <Error message={updatePlantError} />}
          <View style={styles.tabBarInfoContainer}>
            <SavePlantDetail form={form} plantId={id} />
          </View>
        </View>
      );
    }
    console.log('images', images);
    return (
      <View style={styles.container}>
        {editButton}
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.secondPageContentContainer}
        >
          <Text h1 style={styles.listText}>{name}</Text>
          <Text style={styles.listText}>created {created}</Text>
          <View style={styles.imageGroupView}>
            {images.length === 0 && (
              <View>
                <Divider style={styles.divider} />
                <Text style={{ textAlign: 'center' }}>
                  no pictures :( why not add one?
                </Text>
              </View>
            )}
            {imageGroup}
          </View>
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
    singlePlantLoading: PropTypes.bool,
    singlePlantError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
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
  getSingleUserPlant,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlantDetail);
