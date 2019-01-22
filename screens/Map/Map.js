import React from 'react';
import PropTypes from 'prop-types';
import {
  MapView, Icon, Permissions,
} from 'expo';
import { connect } from 'react-redux';
import {
  View,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from 'react-native';

import Error from '../../components/Error';

import { getTrees } from '../../reducers/tree';
import { styles } from '../styles';

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(position => resolve(position), e => reject(e));
  });
};

const defaultDelta = {
  latitudeDelta: 0.003,
  longitudeDelta: 0.003,
};

const defaultRegion = {
  latitude: 40.709094,
  longitude: -74.008541,
  ...defaultDelta,
};

class Map extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    region: defaultRegion,
    createTreeButton: false,
    createTreeLatitude: null,
    createTreeLongitude: null,
    statusBarHeight: 1,
  }

  componentWillMount() {
    // Hack to ensure the showsMyLocationButton is shown initially. Idea is to force a repaint
    setTimeout(() => this.setState({ statusBarHeight: 0 }), 500);
  }

  componentDidMount = () => {
    if (this.props.tree.trees.length === 0) {
      this.getPlants();
    }
    this.getLocationPermissionAsync();
    getCurrentLocation().then(position => {
      if (position) {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            ...defaultDelta,
          },
        });
      }
    });

  }

  getLocationPermissionAsync = async () => {
    await Permissions.askAsync(Permissions.LOCATION);
  }

  clearCreateTreeButton = () => {
    if (this.state.createTreeButton) {
      this.setState({
        createTreeButton: false,
        createTreeLatitude: null,
        createTreeLongitude: null,
      });
    }
  }

  getPlants = () => {
    this.props.getTrees();
  }

  render() {
    const {
      createTreeButton,
      createTreeLatitude,
      createTreeLongitude,
      region,
    } = this.state;
    const {
      trees, treesError, treesLoading,
    } = this.props.tree;
    return (
      <View style={{ flex: 1, paddingTop: this.state.statusBarHeight }}>
        <MapView
          style={{ flex: 1 }}
          region={region}
          onPress={e => {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            this.setState({
              createTreeButton: true,
              createTreeLatitude: latitude,
              createTreeLongitude: longitude,
            });
          }}
          onRegionChange={this.clearCreateTreeButton}
          showsUserLocation
          showsMyLocationButton
          showsPointsOfInterest={false}
          showsCompass={false}
          showsScale={false}
          showsTraffic={false}
          showsIndoorLevelPicker={false}
          toolbarEnabled={false}
        >
          {trees.map((tree, i) => {
            const { latitude, longitude } = tree;
            let species = {
              name: 'Unknown species',
              description: 'Can you help identify this species?',
            };
            if (tree.species_votes.length > 0) {
              ([[{ species }]] = tree.species_votes);
            }
            return (
              <MapView.Marker
                key={`${latitude}-${longitude}-created-${i}-${species.name}`}
                coordinate={{
                  latitude,
                  longitude,
                }}
                title={species.name}
                description={species.description}
                onPress={this.clearCreateTreeButton}
                onCalloutPress={() => {
                  this.props.navigation.navigate(
                    'TreeDetail',
                    { treeId: tree.id },
                  );
                }}
                pinColor="green"
              />
            );
          })}
          {createTreeButton && (
            <MapView.Marker
              key={`${createTreeLatitude}-${createTreeLongitude}`}
              coordinate={{
                latitude: createTreeLatitude,
                longitude: createTreeLongitude,
              }}
              title="A new tree!"
              pinColor="blue"
            >
              <MapView.Callout tooltip />
            </MapView.Marker>
          )}
        </MapView>
        <TouchableOpacity
          onPress={this.getPlants}
          style={styles.topLeftMap}
          disabled={treesLoading}
        >
          {treesLoading
            ? (
              <ActivityIndicator size={32} />
            ) : (
              <Icon.Feather
                name="refresh-cw"
                size={32}
                style={{ opacity: 0.25 }}
              />
            )
          }
        </TouchableOpacity>
        {createTreeButton && (
          <View style={styles.createTreeButton}>
            {this.props.user.sub
              ? (
                <Button
                  title="Create a tree here"
                  onPress={() => this.props.navigation.navigate(
                    'TreeForm',
                    {
                      latitude: createTreeLatitude,
                      longitude: createTreeLongitude,
                      onReturn: this.clearCreateTreeButton,
                    },
                  )}
                />
              )
              : (
                <Button
                  title="You must be signed in to add a tree!"
                  onPress={() => this.props.navigation.navigate('Auth')}
                />
              )
            }
          </View>
        )}
        <View style={styles.tabBarInfoContainer}>
          {treesError && <Error message={treesError} />}
        </View>
      </View>
    );
  }
}

Map.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  navigation: PropTypes.object,
  tree: PropTypes.shape({
    trees: PropTypes.arrayOf(PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      species_votes: PropTypes.array,
    })),
    treesLoading: PropTypes.bool,
    treesError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  getTrees: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    tree: state.tree,
  };
};

const mapDispatchToProps = {
  getTrees,
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
