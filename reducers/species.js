export const GET_SPECIES = 'treemap/species/GET_SPECIES';
export const GET_SPECIES_SUCCESS = 'treemap/species/GET_SPECIES_SUCCESS';
export const GET_SPECIES_FAIL = 'treemap/species/GET_SPECIES_FAIL';

const defaultState = {
  speciesList: [],
  speciesLoading: false,
  speciesError: false,
};

export default function speciesReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_SPECIES:
      return { ...state, speciesLoading: true, speciesError: false };
    case GET_SPECIES_SUCCESS:
      return { ...state, speciesLoading: false, speciesList: action.payload.data };
    case GET_SPECIES_FAIL:
      return { ...state, speciesLoading: false, speciesError: 'There was an error while getting species' };
    default:
      return state;
  }
}

export function getSpecies() {
  return {
    type: GET_SPECIES,
    payload: {
      request: {
        url: '/species',
      },
    },
  };
}
