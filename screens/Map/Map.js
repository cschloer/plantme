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
import { Text } from 'react-native-elements';

import Error from '../../components/Error';
import Loading from '../../components/Loading';

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
    locationLoading: true,
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
      this.getTrees();
    }
    this.getLocationPermissionAsync();
    getCurrentLocation().then(
      position => {
        if (position && this.state.locationLoading) {
          this.setState({
            locationLoading: false,
            region: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              ...defaultDelta,
            },
          });
        }
      },
      () => {
        this.setState({ locationLoading: false });
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params) {
      const { latitude: newLat, longitude: newLong } = nextProps.navigation.state.params;
      let { oldLat, oldLong } = {};
      if (this.props.navigation.state.params) {
        ({ latitude: oldLat, longitude: oldLong } = this.props.navigation.state.params);
      }
      if (
        (
          newLat !== oldLat
          || newLong !== oldLong
        )
        && newLong && newLat
      ) {
        const region = {
          latitude: newLat,
          longitude: newLong,
          ...defaultDelta,

        };
        this.setState({
          locationLoading: false,
          region,
        });
        this.mapView.animateToRegion(region, 1);
      }
    }

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

  getTrees = () => {
    this.props.getTrees();
  }

  render() {
    const {
      createTreeButton,
      createTreeLatitude,
      createTreeLongitude,
      region,
      locationLoading,
    } = this.state;
    const {
      trees, treesError, treesLoading,
    } = this.props.tree;
    if (locationLoading) {
      return <Loading style={{ backgroundColor: 'white' }} size={64} />;
    }
    return (
      <View style={{ flex: 1, paddingTop: this.state.statusBarHeight, backgroundColor: 'white' }}>
        <MapView
          ref={(ref) => { this.mapView = ref; }}
          style={{ flex: 1 }}
          initialRegion={region}
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
                onPress={this.clearCreateTreeButton}
                onCalloutPress={() => {
                  this.props.navigation.navigate(
                    'TreeDetail',
                    { treeId: tree.id },
                  );
                }}
                pinColor="green"
              >
                <Icon.FontAwesome
                  name="circle"
                  color="green"
                  size={32}
                  style={{ opacity: 0.6 }}
                />
                <MapView.Callout>
                  <View style={{ flex: 1, width: 150, flexDirection: 'row' }}>
                    <Text
                      numberOfLines={1}
                    >
                      {species.name}
                    </Text>
                    <Icon.Feather
                      name="chevron-right"
                      size={32}
                    />
                  </View>
                </MapView.Callout>
              </MapView.Marker>
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
          onPress={this.getTrees}
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
          {/* A hack to get the icon to load as the marker */}
          <Icon.FontAwesome
            name="circle"
            style={{
              opacity: 0,
              zIndex: -1000,
              position: 'absolute',
            }}
          />
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
