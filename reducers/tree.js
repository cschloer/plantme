export const GET_TREES = 'treemap/tree/GET_TREES';
export const GET_TREES_SUCCESS = 'treemap/tree/GET_TREES_SUCCESS';
export const GET_TREES_FAIL = 'treemap/tree/GET_TREES_FAIL';
export const CREATE_TREE = 'treemap/tree/CREATE_TREE';
export const CREATE_TREE_SUCCESS = 'treemap/tree/CREATE_TREE_SUCCESS';
export const CREATE_TREE_FAIL = 'treemap/tree/CREATE_TREE_FAIL';

const defaultState = {
  trees: [],
  treesLoading: false,
  treesError: false,
  createTreeLoading: false,
  createTreeError: false,
};

export default function treeReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_TREES:
      return { ...state, treesLoading: true, treesError: false };
    case GET_TREES_SUCCESS:
      return { ...state, treesLoading: false, trees: action.payload.data };
    case GET_TREES_FAIL:
      return { ...state, treesLoading: false, treesError: 'There was an error while getting trees' };
    case CREATE_TREE:
      return { ...state, createTreeLoading: true, createTreeError: false };
    case CREATE_TREE_SUCCESS:
      return { ...state, createTreeLoading: false, trees: [...state.trees, action.payload.data] };
    case CREATE_TREE_FAIL:
      return { ...state, createTreeLoading: false, createTreeError: 'There was an error while creating a tree' };
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

export function createTree(treeForm) {
  return {
    type: CREATE_TREE,
    payload: {
      request: {
        method: 'post',
        url: '/tree/',
        data: treeForm,
      },
    },
  };
}
