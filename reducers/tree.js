import { CREATE_TREE_IMAGE_SUCCESS } from './treeImage';
import {
  CREATE_TREE_SPECIES_VOTE_SUCCESS,
  UPDATE_TREE_SPECIES_VOTE_SUCCESS,
} from './treeSpeciesVote';
import { CREATE_POST_SUCCESS } from './post';

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

const updateTrees = (trees, treeId, callback) => {
  return trees.map((tree) => {
    if (tree.id === treeId) {
      return callback(tree);
    }
    return tree;
  });
};

export default function treeReducer(state = defaultState, action) {
  const {
    payload: {
      data,
    } = {},
  } = action;
  switch (action.type) {
    case GET_TREES:
      return { ...state, treesLoading: true, treesError: false };
    case GET_TREES_SUCCESS:
      return { ...state, treesLoading: false, trees: data };
    case GET_TREES_FAIL:
      return { ...state, treesLoading: false, treesError: 'There was an error while getting trees' };
    case CREATE_TREE:
      return { ...state, createTreeLoading: true, createTreeError: false };
    case CREATE_TREE_SUCCESS:
      return { ...state, createTreeLoading: false, trees: [...state.trees, data] };
    case CREATE_TREE_FAIL:
      return { ...state, createTreeLoading: false, createTreeError: 'There was an error while creating a tree' };
    case CREATE_TREE_IMAGE_SUCCESS:
      return {
        ...state,
        trees: updateTrees(
          state.trees,
          data.tree_id,
          (tree) => {
            return {
              ...tree,
              images: [...tree.images, data],
            };
          }
        ),
      };
    case CREATE_TREE_SPECIES_VOTE_SUCCESS:
    case UPDATE_TREE_SPECIES_VOTE_SUCCESS:
      return {
        ...state,
        trees: updateTrees(
          state.trees,
          data.tree_id,
          (tree) => {
            let newVoteAdded = false;
            return {
              ...tree,
              species_votes: tree.species_votes.map((voteTally) => {
                // Filter the old species_vote out if this is an update
                const newVoteTally = voteTally.filter(vote => vote.id !== data.id);
                // Add species_vote to the object
                if (newVoteTally.length && newVoteTally[0].species_id === data.species_id) {
                  newVoteAdded = true;
                  return [...newVoteTally, data];
                }
                return newVoteTally;

                // Add the data if it's a brand new species
              }).concat(
                newVoteAdded ? [] : [[data]]

                // Delete empty lists
              ).filter(
                (voteTally) => voteTally.length > 0

                // Sort the result
              ).sort(
                (a, b) => {
                  const diff = b.length - a.length;
                  // Equal votes are broken by whichever vote has the lowest id
                  if (diff === 0) {
                    const minA = a.reduce((acc, vote) => {
                      if (acc === -1 || vote.id < acc) {
                        return vote.id;
                      }
                      return acc;
                    }, -1);
                    const minB = b.reduce((acc, vote) => {
                      if (acc === -1 || vote.id < acc) {
                        return vote.id;
                      }
                      return acc;
                    }, -1);
                    return minA - minB;
                  }
                  return diff;
                }
              ),
            };
          }
        ),
      };
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        trees: [...state.trees, data.tree],
      };
    default:
      return state;
  }
}

export function getTrees(params = {}, filters = []) {
  const paramString = Object.keys(params).reduce(
    (acc, param) => `${acc}${param}=${params[param]}&`,
    '',
  );
  const filterString = filters.reduce(
    (acc, filter) => `${acc}filter=${filter}&`,
    '',
  );
  return {
    type: GET_TREES,
    payload: {
      request: {
        url: `/tree/?${paramString}${filterString}`,

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
