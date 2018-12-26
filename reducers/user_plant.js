export const GET_USER_PLANTS = 'plantme/user_plant/GET_USER_PLANTS';
export const GET_USER_PLANTS_SUCCESS = 'plantme/user_plant/GET_USER_PLANTS_SUCCESS';
export const GET_USER_PLANTS_FAIL = 'plantme/user_plant/GET_USER_PLANTS_FAIL';

export const GET_SINGLE_USER_PLANT = 'plantme/user_plant/GET_SINGLE_USER_PLANT';
export const GET_SINGLE_USER_PLANT_SUCCESS = 'plantme/user_plant/GET_SINGLE_USER_PLANT_SUCCESS';
export const GET_SINGLE_USER_PLANT_FAIL = 'plantme/user_plant/GET_SINGLE_USER_PLANT_FAIL';

const defaultState = {
  plants: [],
  loading: false,
  error: false,
  singlePlant: {},
  singePlantLoading: false,
  singlePlantError: false,
};

export default function userPlantReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_USER_PLANTS:
      return { ...state, loading: true };
    case GET_USER_PLANTS_SUCCESS:
      return { ...state, loading: false, plants: action.payload.data };
    case GET_USER_PLANTS_FAIL:
      return { ...state, loading: false, error: 'There was an error while loading plants' };
    case GET_SINGLE_USER_PLANT:
      return { ...state, singlePlantLoading: true };
    case GET_SINGLE_USER_PLANT_SUCCESS:
      return { ...state, singlePlantLoading: false, singlePlant: action.payload.data };
    case GET_SINGLE_USER_PLANT_FAIL:
      return { ...state, singlePlantLoading: false, singlePlantError: 'There was an error while loading the plant' };
    default:
      return state;
  }
}

export function getUserPlants(userId) {
  return {
    type: GET_USER_PLANTS,
    payload: {
      request: {
        url: `/userplant?user_id=${userId}`,
      },
    },
  };
}

export function getSingleUserPlant(plantId) {
  return {
    type: GET_SINGLE_USER_PLANT,
    payload: {
      request: {
        url: `/userplant/${plantId}`,
      },
    },
  };
}
