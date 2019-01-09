import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { Icon } from 'expo';

class SpeciesListItem extends React.Component {

  handleTreeFactDetail = () => {
    this.props.navigation.navigate(
      'WebScreen',
      { uri: 'https://en.wikipedia.org/wiki/Ginkgo' },
    );
  };

  render() {
    const {
      subtitle, species,
      leftIcon, onPress,
    } = this.props;
    return (
      <ListItem
        title={species.name}
        subtitle={subtitle}
        leftIcon={leftIcon}
        onPress={onPress}
        containerStyle={{ paddingVertical: 0, paddingRight: 0 }}
        rightElement={(
          <TouchableOpacity
            onPress={() => this.handleTreeFactDetail()}
          >
            <Icon.Feather
              name="info"
              size={40}
              style={{ padding: 7 }}
            />
          </TouchableOpacity>
        )}
        topDivider
        bottomDivider
      />
    );
  }
}

SpeciesListItem.propTypes = {
  subtitle: PropTypes.string,
  species: PropTypes.shape({
    name: PropTypes.string,

  }),
  leftIcon: PropTypes.object,
  onPress: PropTypes.func,
  navigation: PropTypes.object.isRequired,
};

export default SpeciesListItem;
