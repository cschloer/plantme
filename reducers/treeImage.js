export const GENERATE_IMAGE_URL = 'plantme/tree_image/GENERATE_IMAGE_URL';
export const GENERATE_IMAGE_URL_SUCCESS = 'plantme/tree_image/GENERATE_IMAGE_URL_SUCCESS';
export const GENERATE_IMAGE_URL_FAIL = 'plantme/tree_image/GENERATE_IMAGE_URL_FAIL';

export const CREATE_TREE_IMAGE = 'plantme/tree_image/CREATE_TREE_IMAGE';
export const CREATE_TREE_IMAGE_SUCCESS = 'plantme/tree_image/CREATE_TREE_IMAGE_SUCCESS';
export const CREATE_TREE_IMAGE_FAIL = 'plantme/tree_image/CREATE_TREE_IMAGE_FAIL';

const defaultState = {
  imageUrl: null,
  generateImageUrlLoading: false,
  generateImageUrlError: false,
  createTreeImageLoading: false,
  createTreeImageError: false,
};

export default function treeImageReducer(state = defaultState, action) {
  switch (action.type) {
    case GENERATE_IMAGE_URL:
      return { ...state, generateImageUrlLoading: true, generateImageUrlError: false };
    case GENERATE_IMAGE_URL_SUCCESS:
      return { ...state, generateImageUrlLoading: false, imageUrl: action.payload.data.url };
    case GENERATE_IMAGE_URL_FAIL:
      return { ...state, generateImageUrlLoading: false, generateImageUrlError: 'There was an error while generating the image url' };
    case CREATE_TREE_IMAGE:
      return { ...state, createTreeImageLoading: true, createTreeImageError: false };
    case CREATE_TREE_IMAGE_SUCCESS:
      return { ...state, createTreeImageLoading: false };
    case CREATE_TREE_IMAGE_FAIL:
      return { ...state, createTreeImageLoading: false, createTreeImageError: 'There was an error while uploading the picture' };
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
        url: '/treeimage/storage/',
        data: {
          base64,
          name,
          content_type: contentType,
        },
      },
    },
  };
}

export function createTreeImage(treeId, userId, url) {
  return {
    type: CREATE_TREE_IMAGE,
    payload: {
      request: {
        method: 'post',
        url: '/treeimage/',
        data: {
          tree_id: treeId,
          user_id: userId,
          url,
        },
      },
    },
  };
}
