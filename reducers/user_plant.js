export const GET_USER_PLANTS = 'plantme/user_plant/GET_USER_PLANTS';
export const GET_USER_PLANTS_SUCCESS = 'plantme/user_plant/GET_USER_PLANTS_SUCCESS';
export const GET_USER_PLANTS_FAIL = 'plantme/user_plant/GET_USER_PLANTS_FAIL';

export const CREATE_USER_PLANT = 'plantme/user_plant/CREATE_USER_PLANT';
export const CREATE_USER_PLANT_SUCCESS = 'plantme/user_plant/CREATE_USER_PLANT_SUCCESS';
export const CREATE_USER_PLANT_FAIL = 'plantme/user_plant/CREATE_USER_PLANT_FAIL';

export const UPDATE_USER_PLANT = 'plantme/user_plant/UPDATE_USER_PLANT';
export const UPDATE_USER_PLANT_SUCCESS = 'plantme/user_plant/UPDATE_USER_PLANT_SUCCESS';
export const UPDATE_USER_PLANT_FAIL = 'plantme/user_plant/UPDATE_USER_PLANT_FAIL';

export const GET_SINGLE_USER_PLANT = 'plantme/user_plant/GET_SINGLE_USER_PLANT';
export const GET_SINGLE_USER_PLANT_SUCCESS = 'plantme/user_plant/GET_SINGLE_USER_PLANT_SUCCESS';
export const GET_SINGLE_USER_PLANT_FAIL = 'plantme/user_plant/GET_SINGLE_USER_PLANT_FAIL';

const defaultState = {
  plants: [],
  plantsLoading: false,
  plantsError: false,
  createPlantLoading: false,
  createPlantError: false,
  updatePlantLoading: false,
  updatePlantError: false,
  singlePlant: {},
  singePlantLoading: false,
  singlePlantError: false,
};

export default function userPlantReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_USER_PLANTS:
      return { ...state, plantsLoading: true, plantsError: false };
    case GET_USER_PLANTS_SUCCESS:
      return { ...state, plantsLoading: false, plants: action.payload.data };
    case GET_USER_PLANTS_FAIL:
      return { ...state, plantsLoading: false, plantsError: 'There was an error while loading plants' };
    case CREATE_USER_PLANT:
      return { ...state, createPlantLoading: true, createPlantError: false };
    case CREATE_USER_PLANT_SUCCESS:
      return {
        ...state,
        createPlantLoading: false,
        // create the plants object with the new created plant
        plants: [...state.plants, action.payload.data],
      };
      // return { ...state, createPlantLoading: false, plants: action.payload.data };
    case CREATE_USER_PLANT_FAIL:
      return { ...state, createPlantLoading: false, createPlantError: 'There was an error while creating a plant' };
    case UPDATE_USER_PLANT:
      return { ...state, updatePlantLoading: true, updatePlantError: false };
    case UPDATE_USER_PLANT_SUCCESS:
      return {
        ...state,
        updatePlantLoading: false,
        // Update the plants object with the new updated plant
        plants: state.plants.map((plant) => {
          if (plant.id === action.payload.data.id) {
            return action.payload.data;
          }
          return plant;
        }),
        // Update the single plant object with the new updated plant if necessary
        singlePlant: (state.singlePlant.id === action.payload.data.id)
          ? action.payload.data : state.singlePlant,
      };
      // return { ...state, updatePlantLoading: false, plants: action.payload.data };
    case UPDATE_USER_PLANT_FAIL:
      return { ...state, updatePlantLoading: false, updatePlantError: 'There was an error while updating a plant' };
    case GET_SINGLE_USER_PLANT:
      return { ...state, singlePlantLoading: true, singlePlantError: false };
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
        url: `/userplant?user_id=${userId}&order=asc`,
      },
    },
  };
}

export function createUserPlant(plantForm) {
  return {
    type: CREATE_USER_PLANT,
    payload: {
      request: {
        method: 'post',
        url: '/userplant/',
        data: plantForm,
      },
    },
  };
}

export function updateUserPlant(plantId, plantForm) {
  return {
    type: UPDATE_USER_PLANT,
    payload: {
      request: {
        method: 'put',
        url: `/userplant/${plantId}`,
        data: plantForm,
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
