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
import Loading from '../components/Loading';
import Error from '../components/Error';

class SearchSpeciesModal extends React.Component {

  static navigationOptions = {
    header: null,
  }


  state = {
    results: [],
    loading: false,
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
    clearTimeout(this.filterResultsTimeout)
    if (!searchText) {
      this.setState({
        results: speciesList,
        loading: false,
      });
    } else {
      this.setState({ loading: true });
      this.filterResultsTimeout = setTimeout(() => this.filterResults(speciesList, searchText), 50);
    }
  }

  filterResults = (speciesList, searchText) => {
    const results = speciesList.filter(
      species => (
        species.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        || species.latin_name.toLowerCase().indexOf(searchText.toLowerCase()) > -1
      )
    );
    this.setState({
      loading: false,
      results,
    });
  }



  // Render any loading content that you like here
  render() {
    const { results, loading } = this.state;
    const { speciesLoading, speciesError } = this.props.species;
    let content = (
      <Loading />
    );
    if (!speciesLoading) {
      if (speciesError) {
        content = <Error speciesError />;
      } else {
        content = (
          <FlatList
            data={results.map(
              (result) => { return { ...result, key: result.id.toString() }; }
            )}
            renderItem={({ item }) => {
              return (
                <SpeciesListItem
                  species={item}
                  subtitle={item.latin_name}
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
        );
      }
    }
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
                showLoading={loading}
                lightTheme
                onChangeText={this.onChangeText}
                onClear={() => this.onChangeText('')}
                placeholder="Search for a species"
              />
              {content}
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
