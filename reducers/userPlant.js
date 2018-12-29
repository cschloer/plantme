import {
  CREATE_USER_PLANT_IMAGE_SUCCESS,
  DELETE_USER_PLANT_IMAGE_SUCCESS,
} from './userPlantImage';

export const GET_USER_PLANTS = 'plantme/user_plant/GET_USER_PLANTS';
export const GET_USER_PLANTS_SUCCESS = 'plantme/user_plant/GET_USER_PLANTS_SUCCESS';
export const GET_USER_PLANTS_FAIL = 'plantme/user_plant/GET_USER_PLANTS_FAIL';

export const CREATE_USER_PLANT = 'plantme/user_plant/CREATE_USER_PLANT';
export const CREATE_USER_PLANT_SUCCESS = 'plantme/user_plant/CREATE_USER_PLANT_SUCCESS';
export const CREATE_USER_PLANT_FAIL = 'plantme/user_plant/CREATE_USER_PLANT_FAIL';

export const UPDATE_USER_PLANT = 'plantme/user_plant/UPDATE_USER_PLANT';
export const UPDATE_USER_PLANT_SUCCESS = 'plantme/user_plant/UPDATE_USER_PLANT_SUCCESS';
export const UPDATE_USER_PLANT_FAIL = 'plantme/user_plant/UPDATE_USER_PLANT_FAIL';

export const DELETE_USER_PLANT = 'plantme/user_plant/DELETE_USER_PLANT';
export const DELETE_USER_PLANT_SUCCESS = 'plantme/user_plant/DELETE_USER_PLANT_SUCCESS';
export const DELETE_USER_PLANT_FAIL = 'plantme/user_plant/DELETE_USER_PLANT_FAIL';

export const GET_SINGLE_USER_PLANT = 'plantme/user_plant/GET_SINGLE_USER_PLANT';
export const GET_SINGLE_USER_PLANT_SUCCESS = 'plantme/user_plant/GET_SINGLE_USER_PLANT_SUCCESS';
export const GET_SINGLE_USER_PLANT_FAIL = 'plantme/user_plant/GET_SINGLE_USER_PLANT_FAIL';

// Create user image plant image must be here in order to manipulate the state of the user plant

const defaultState = {
  plants: [],
  plantsLoading: false,
  plantsError: false,
  createPlantLoading: false,
  createPlantError: false,
  updatePlantLoading: false,
  updatePlantError: false,
  deletePlantLoading: false,
  deletePlantError: false,
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
        // Update the plants object with the new plant
        plants: [...state.plants, action.payload.data],
      };
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
    case UPDATE_USER_PLANT_FAIL:
      return { ...state, updatePlantLoading: false, updatePlantError: 'There was an error while updating a plant' };
    case DELETE_USER_PLANT:
      return { ...state, deletePlantLoading: true, deletePlantError: false };
    case DELETE_USER_PLANT_SUCCESS:
      return {
        ...state,
        deletePlantLoading: false,
        // Update the plants object with the new deleted plant
        plants: state.plants.filter(plant => (
          plant.id !== action.payload.data.id
        )),
        // delete the single plant object with the new deleted plant if necessary
        singlePlant: (state.singlePlant.id === action.payload.data.id)
          ? {} : state.singlePlant,
      };
      // return { ...state, deletePlantLoading: false, plants: action.payload.data };
    case DELETE_USER_PLANT_FAIL:
      return { ...state, deletePlantLoading: false, deletePlantError: 'There was an error while deleting a plant' };
    case GET_SINGLE_USER_PLANT:
      return { ...state, singlePlantLoading: true, singlePlantError: false };
    case GET_SINGLE_USER_PLANT_SUCCESS:
      return { ...state, singlePlantLoading: false, singlePlant: action.payload.data };
    case GET_SINGLE_USER_PLANT_FAIL:
      return { ...state, singlePlantLoading: false, singlePlantError: 'There was an error while loading the plant' };
    // When a user plant image is created, user plant state must be updated
    case CREATE_USER_PLANT_IMAGE_SUCCESS:
      return {
        ...state,
        // Update the plants object with the new plant image
        plants: state.plants.map((plant) => {
          if (plant.id === action.payload.data.user_plant_id) {
            return {
              ...plant,
              images: [action.payload.data, ...plant.images],
            };
          }
          return plant;
        }),
        // Update the single plant object with the new plant image if necessary
        singlePlant: (state.singlePlant.id === action.payload.data.user_plant_id)
          ? { ...state.singlePlant, images: [action.payload.data, ...state.singlePlant.images] }
          : state.singlePlant,
      };
    // When a user plant image is delete, user plant state must be updated
    case DELETE_USER_PLANT_IMAGE_SUCCESS:
      return {
        ...state,
        // Update the plants object with the new plant image
        plants: state.plants.map((plant) => {
          if (plant.id === action.payload.data.user_plant_id) {
            return {
              ...plant,
              images: plant.images.filter((image) => (
                image.id !== action.payload.data.id
              )),
            };
          }
          return plant;
        }),
        // Update the single plant object with the new plant image if necessary
        singlePlant: (state.singlePlant.id === action.payload.data.user_plant_id)
          ? {
            ...state.singlePlant,
            images: state.singlePlant.images.filter((image) => (
              image.id !== action.payload.data.id
            )),
          } : state.singlePlant,
      };
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

export function deleteUserPlant(plantId) {
  return {
    type: DELETE_USER_PLANT,
    payload: {
      request: {
        method: 'delete',
        url: `/userplant/${plantId}`,
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
