import React from 'react';
import PropTypes from 'prop-types';
import { MapView, Icon } from 'expo';
import { connect } from 'react-redux';
import {
  View,
  TouchableOpacity,
  Button,
} from 'react-native';

import Error from '../../components/Error';

import { getTrees } from '../../reducers/tree';
import { styles } from '../styles';

class Map extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    createTreeButton: false,
    createTreeLatitude: null,
    createTreeLongitude: null,
  }

  componentDidMount = () => {
    if (this.props.tree.trees.length === 0) {
      this.getPlants();
    }
  }

  clearCreateTreeButton = () => {
    this.setState({
      createTreeButton: false,
      createTreeLatitude: null,
      createTreeLongitude: null,
    });
  }

  getPlants = () => {
    this.props.getTrees();
  }

  render() {
    const {
      createTreeButton,
      createTreeLatitude,
      createTreeLongitude,
    } = this.state;
    const {
      trees, treesError, treesLoading,
    } = this.props.tree;
    if (treesError) {
      return (
        <Error message={treesError} />
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 40.709094,
            longitude: -74.008541,
            latitudeDelta: 0.0411,
            longitudeDelta: 0.0210,
          }}
          onPress={e => {
            console.log('ON PRES');
            const { latitude, longitude } = e.nativeEvent.coordinate;
            this.setState({
              createTreeButton: true,
              createTreeLatitude: latitude,
              createTreeLongitude: longitude,
            });
          }}
        >
          {trees.map((tree, i) => {
            const { latitude, longitude } = tree;
            let species = {
              name: 'Unknown species',
              description: 'Can you help identify this species?',
            };
            if (tree.species_votes.length > 0) {
              // TODO: make sure either here or backend that it has th most votes
              ([{ species }] = tree.species_votes);
            }
            return (
              <MapView.Marker
                key={`${latitude}-${longitude}-created-${i}`}
                coordinate={{
                  latitude,
                  longitude,
                }}
                title={species.name}
                description={species.description}
                onPress={this.clearCreateTreeButton}
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
          style={styles.refreshMap}
          disabled={treesLoading}
        >
          <Icon.Feather
            name="refresh-cw"
            size={32}
          />
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
