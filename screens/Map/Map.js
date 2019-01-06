import React from 'react';
import PropTypes from 'prop-types';
import { MapView, Icon } from 'expo';
import { connect } from 'react-redux';
import {
  View,
  TouchableOpacity,
} from 'react-native';

import Loading from '../../components/Loading';
import Error from '../../components/Error';

import { getTrees } from '../../reducers/tree';
import { styles } from '../styles';

class Map extends React.Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount = () => {
    if (this.props.tree.trees.length === 0) {
      this.getPlants();
    }
  }

  getPlants = () => {
    this.props.getTrees();
  }

  render() {
    const {
      trees, treesError, treesLoading,
    } = this.props.tree;
    console.log(trees);
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
          onPress={e => { console.log('coord', e.nativeEvent); }}
        >
          {trees.map((tree, i) => {
            if (tree.locations.length === 0) {
              return null;
            }
            const [loc] = tree.locations;
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
                key={i}
                coordinate={{
                  latitude: loc.latitude,
                  longitude: loc.longitude,
                }}
                title={species.name}
                description={species.description}
              />
            );
          })}

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
      </View>
    );
  }
}

Map.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  tree: PropTypes.object,
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
