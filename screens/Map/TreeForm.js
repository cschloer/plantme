import React from 'react';
import PropTypes from 'prop-types';
import { MapView, Icon } from 'expo';
import { connect } from 'react-redux';
import {
  View,
  Button,
  Picker,
  ActivityIndicator
} from 'react-native';

import Error from '../../components/Error';
import Loading from '../../components/Loading';

import { getSpecies } from '../../reducers/species';
import { createTree } from '../../reducers/tree';
import { styles } from '../styles';

class TreeForm extends React.Component {
  static navigationOptions = {
    title: 'Add a tree',
  };

  state = {
    species: {},
  }

  componentDidMount() {
    const { speciesList, speciesLoading } = this.props.species;
    if (speciesList.length === 0 && !speciesLoading) {
      this.props.getSpecies();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { createTreeLoading: nextLoading, createTreeError: nextError } = nextProps.tree;
    const { createTreeLoading: prevLoading } = this.props.tree;
    if (prevLoading && !nextLoading && !nextError) {
      const onReturn = this.props.navigation.getParam('onReturn', false);
      if (onReturn) {
        onReturn();
      }
      this.props.navigation.navigate(
        'Map',
      );
    }
  }

  createTree = () => {
    /* eslint-disable camelcase */
    const { sub: user_id } = this.props.user;
    /* eslint-enable camelcase */
    const longitude = this.props.navigation.getParam('longitude', false);
    const latitude = this.props.navigation.getParam('latitude', false);
    const { species } = this.state;

    this.props.createTree({
      user_id,
      latitude,
      longitude,
      species_votes: [{
        user_id,
        species_id: species.id,
      }],
    });
  }

  render() {
    const {
      speciesList, speciesLoading, speciesError,
    } = this.props.species;
    const {
      createTreeLoading, createTreeError,
    } = this.props.tree;
    console.log('error', speciesError);
    console.log('loading', speciesLoading);
    if (speciesError) {
      return <Error message={speciesError} />;
    }
    return (
      <View style={styles.container}>
        {speciesLoading
          ? <Loading />
          : (
            <Picker
              selectedValue={this.state.species.id}
              onValueChange={(chosenValue) => {
                const species = speciesList.reduce((acc, speciesDict) => {
                  if (!acc && speciesDict.id === chosenValue) {
                    return speciesDict;
                  }
                  return acc;
                }, null);
                this.setState({ species });
              }}
            >
              {/*
                TODO: remove this picker if a species has been selected
              */}
              <Picker.Item
                label="Select a species"
                value={{}}
              />
              {speciesList.map(speciesDict => (
                <Picker.Item
                  key={speciesDict.id}
                  label={speciesDict.name}
                  value={speciesDict.id}
                />
              ))}
            </Picker>
          )
        }
        {this.state.species.id && (
          <View>
            {createTreeLoading
              ? <ActivityIndicator size={32} />
              : (
                <Button
                  title="add tree"
                  onPress={this.createTree}
                />
              )
            }
          </View>
        )}
        <View style={styles.tabBarInfoContainer}>
          {createTreeError && <Error message={createTreeError} />}
        </View>
      </View>
    );
  }
}

TreeForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    sub: PropTypes.string,
  }),
  species: PropTypes.shape({
    speciesLoading: PropTypes.bool,
    speciesError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    speciesList: PropTypes.array,
  }),
  tree: PropTypes.shape({
    createTreeLoading: PropTypes.bool,
    createTreeError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  navigation: PropTypes.object,
  getSpecies: PropTypes.func,
  createTree: PropTypes.func,
};

const mapStateToProps = state => {
  return {
    user: state.login.profile,
    species: state.species,
    tree: state.tree,
  };
};

const mapDispatchToProps = {
  getSpecies,
  createTree,
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeForm);
