export const GENERATE_IMAGE_URL = 'plantme/user_plant_image/GENERATE_IMAGE_URL';
export const GENERATE_IMAGE_URL_SUCCESS = 'plantme/user_plant_image/GENERATE_IMAGE_URL_SUCCESS';
export const GENERATE_IMAGE_URL_FAIL = 'plantme/user_plant_image/GENERATE_IMAGE_URL_FAIL';

const defaultState = {
  imageUrl: null,
  generateImageUrlLoading: false,
  generateImageUrlError: false,
};

export default function userPlantImageReducer(state = defaultState, action) {
  switch (action.type) {
    case GENERATE_IMAGE_URL:
      return { ...state, generateImageUrlLoading: true, generateImageUrlError: false };
    case GENERATE_IMAGE_URL_SUCCESS:
      return { ...state, generateImageUrlLoading: false, imageUrl: action.payload.data.url };
    case GENERATE_IMAGE_URL_FAIL:
      return { ...state, generateImageUrlLoading: false, generateImageUrlError: 'There was an error while generating the image url' };
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
