export const GET_TREES = 'treemap/tree/GET_TREES';
export const GET_TREES_SUCCESS = 'treemap/tree/GET_TREES_SUCCESS';
export const GET_TREES_FAIL = 'treemap/tree/GET_TREES_FAIL';

const defaultState = {
  trees: [],
  treesLoading: false,
  treesError: false,
};

export default function treeReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_TREES:
      return { ...state, treesLoading: true, treesError: false };
    case GET_TREES_SUCCESS:
      return { ...state, treesLoading: false, trees: action.payload.data };
    case GET_TREES_FAIL:
      return { ...state, treesLoading: false, treesError: 'There was an error while getting trees' };
    default:
      return state;
  }
}

export function getTrees() {
  return {
    type: GET_TREES,
    payload: {
      request: {
        url: `/tree`,
      },
    },
  };
}
