export const GENERATE_IMAGE_URL = 'plantme/user_plant_image/GENERATE_IMAGE_URL';
export const GENERATE_IMAGE_URL_SUCCESS = 'plantme/user_plant_image/GENERATE_IMAGE_URL_SUCCESS';
export const GENERATE_IMAGE_URL_FAIL = 'plantme/user_plant_image/GENERATE_IMAGE_URL_FAIL';

export const CREATE_USER_PLANT_IMAGE = 'plantme/user_plant_image/CREATE_USER_PLANT_IMAGE';
export const CREATE_USER_PLANT_IMAGE_SUCCESS = 'plantme/user_plant_image/CREATE_USER_PLANT_IMAGE_SUCCESS';
export const CREATE_USER_PLANT_IMAGE_FAIL = 'plantme/user_plant_image/CREATE_USER_PLANT_IMAGE_FAIL';

export const DELETE_USER_PLANT_IMAGE = 'plantme/user_plant_image/DELETE_USER_PLANT_IMAGE';
export const DELETE_USER_PLANT_IMAGE_SUCCESS = 'plantme/user_plant_image/DELETE_USER_PLANT_IMAGE_SUCCESS';
export const DELETE_USER_PLANT_IMAGE_FAIL = 'plantme/user_plant_image/DELETE_USER_PLANT_IMAGE_FAIL';

const defaultState = {
  imageUrl: null,
  generateImageUrlLoading: false,
  generateImageUrlError: false,
  createUserPlantImageLoading: false,
  createUserPlantImageError: false,
  deleteUserPlantImageLoading: false,
  deleteUserPlantImageError: false,
};

export default function userPlantImageReducer(state = defaultState, action) {
  switch (action.type) {
    case GENERATE_IMAGE_URL:
      return { ...state, generateImageUrlLoading: true, generateImageUrlError: false };
    case GENERATE_IMAGE_URL_SUCCESS:
      return { ...state, generateImageUrlLoading: false, imageUrl: action.payload.data.url };
    case GENERATE_IMAGE_URL_FAIL:
      return { ...state, generateImageUrlLoading: false, generateImageUrlError: 'There was an error while generating the image url' };
    case CREATE_USER_PLANT_IMAGE:
      return { ...state, createUserPlantImageLoading: true, createUserPlantImageError: false };
    case CREATE_USER_PLANT_IMAGE_SUCCESS:
      return { ...state, createUserPlantImageLoading: false };
    case CREATE_USER_PLANT_IMAGE_FAIL:
      return { ...state, createUserPlantImageLoading: false, createUserPlantImageError: 'There was an error while uploading the picture' };
    case DELETE_USER_PLANT_IMAGE:
      return { ...state, deleteUserPlantImageLoading: true, deleteUserPlantImageError: false };
    case DELETE_USER_PLANT_IMAGE_SUCCESS:
      return { ...state, deleteUserPlantImageLoading: false };
    case DELETE_USER_PLANT_IMAGE_FAIL:
      return { ...state, deleteUserPlantImageLoading: false, deleteUserPlantImageError: 'There was an error while deleting the picture' };
    default:
      return state;
  }
}

export function generateImageUrl(base64, name, contentType) {
  return {
    type: GENERATE_IMAGE_URL,
    payload: {
      request: {
        method: 'post',
        url: '/userplantimage/storage/',
        data: {
          base64,
          name,
          content_type: contentType,
        },
      },
    },
  };
}

export function createUserPlantImage(plantId, url) {
  return {
    type: CREATE_USER_PLANT_IMAGE,
    payload: {
      request: {
        method: 'post',
        url: '/userplantimage/',
        data: {
          user_plant_id: plantId,
          url,
        },
      },
    },
  };
}

export function deleteUserPlantImage(imageId) {
  return {
    type: DELETE_USER_PLANT_IMAGE,
    payload: {
      request: {
        method: 'delete',
        url: `/userplantimage/${imageId}`,
      },
    },
  };
}
