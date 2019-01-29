import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { Icon } from 'expo';

export default function SpeciesListItem({
  subtitle,
  species,
  leftIcon,
  onPress,
  navigation,
}) {
  return (
    <ListItem
      title={species.name}
      subtitle={subtitle}
      leftIcon={leftIcon}
      onPress={onPress}
      containerStyle={{ paddingVertical: 0, paddingRight: 0 }}
      rightElement={(
        <TouchableOpacity
          onPress={() => navigation.navigate(
            'WebScreen',
            { uri: 'https://en.wikipedia.org/wiki/Ginkgo' },
          )}
        >
          <Icon.Feather
            name="info"
            size={40}
            style={{ padding: 7 }}
          />
        </TouchableOpacity>
      )}
      topDivider
    />
  );

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
