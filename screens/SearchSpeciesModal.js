import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { SearchBar } from 'react-native-elements';

import { getSpecies } from '../reducers/species';
import SpeciesListItem from '../components/SpeciesListItem';

class SearchSpeciesModal extends React.Component {

  static navigationOptions = {
    header: null,
  }


  state = {
    results: [],
  };

  componentDidMount() {
    const { speciesList, speciesLoading } = this.props.species;
    if (!speciesLoading) {
      if (speciesList.length === 0) {
        this.props.getSpecies();
      } else {
        this.setState({ results: speciesList });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      speciesLoading: nextSpeciesLoading,
      speciesError: nextSpeciesError,
      speciesList,
    } = nextProps.species;
    const { speciesLoading: prevSpeciesLoading } = this.props.species;
    if (
      prevSpeciesLoading && !nextSpeciesLoading && !nextSpeciesError
    ) {
      this.setState({ results: speciesList });
    }
  }


  onChangeText = (searchText) => {
    const { speciesList } = this.props.species;
    if (!searchText) {
      this.setState({ results: speciesList });
    } else {
      this.setState({
        results: speciesList.filter(
          species => species.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        ),
      });
    }
  };

  // Render any loading content that you like here
  render() {
    const { results } = this.state;
    return (
      <TouchableWithoutFeedback
        onPress={() => this.props.navigation.goBack()}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingVertical: 60,
            paddingHorizontal: 20,
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                height: '100%',
                width: '100%',
                backgroundColor: 'white',
                justifyContent: 'center',
                padding: 5,
              }}
            >
              <SearchBar
                lightTheme
                onChangeText={this.onChangeText}
                onClear={() => this.onChangeText('')}
                placeholder="Search for a species"
              />
              <FlatList
                data={results.map(
                  (result) => { return { ...result, key: result.id.toString() }; }
                )}
                renderItem={({ item }) => {
                  return (
                    <SpeciesListItem
                      species={item}
                      navigation={this.props.navigation}
                      onPress={() => {
                        const onSpeciesSelect = this.props.navigation.getParam('onSpeciesSelect', null);
                        if (onSpeciesSelect) {
                          onSpeciesSelect(item);
                        }
                        this.props.navigation.goBack();
                      }}
                    />
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );

  }
}

SearchSpeciesModal.propTypes = {
  getSpecies: PropTypes.func,
  species: PropTypes.shape({
    speciesList: PropTypes.array,
    speciesLoading: PropTypes.bool,
    speciesError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }),
  navigation: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    species: state.species,
  };
};

const mapDispatchToProps = {
  getSpecies,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchSpeciesModal);
