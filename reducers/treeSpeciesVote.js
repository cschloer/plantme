export const CREATE_TREE_SPECIES_VOTE = 'treemap/tree_species_vote/CREATE_TREE_SPECIES_VOTE';
export const CREATE_TREE_SPECIES_VOTE_SUCCESS = 'treemap/tree_species_vote/CREATE_TREE_SPECIES_VOTE_SUCCESS';
export const CREATE_TREE_SPECIES_VOTE_FAIL = 'treemap/tree_species_vote/CREATE_TREE_SPECIES_VOTE_FAIL';
export const UPDATE_TREE_SPECIES_VOTE = 'treemap/tree_species_vote/UPDATE_TREE_SPECIES_VOTE';
export const UPDATE_TREE_SPECIES_VOTE_SUCCESS = 'treemap/tree_species_vote/UPDATE_TREE_SPECIES_VOTE_SUCCESS';
export const UPDATE_TREE_SPECIES_VOTE_FAIL = 'treemap/tree_species_vote/UPDATE_TREE_SPECIES_VOTE_FAIL';

const defaultState = {
  createTreeSpeciesVoteLoading: false,
  createTreeSpeciesVoteError: false,
  updateTreeSpeciesVoteLoading: false,
  updateTreeSpeciesVoteError: false,
};

export default function treeSpeciesVoteReducer(state = defaultState, action) {
  switch (action.type) {
    case CREATE_TREE_SPECIES_VOTE:
      return { ...state, createTreeSpeciesVoteLoading: true, createTreeSpeciesVoteError: false };
    case CREATE_TREE_SPECIES_VOTE_SUCCESS:
      return { ...state, createTreeSpeciesVoteLoading: false };
    case CREATE_TREE_SPECIES_VOTE_FAIL:
      return { ...state, createTreeSpeciesVoteLoading: false, createTreeSpeciesVoteError: 'There was an error while adding a species vote' };
    case UPDATE_TREE_SPECIES_VOTE:
      return { ...state, updateTreeSpeciesVoteLoading: true, updateTreeSpeciesVoteError: false };
    case UPDATE_TREE_SPECIES_VOTE_SUCCESS:
      return { ...state, updateTreeSpeciesVoteLoading: false };
    case UPDATE_TREE_SPECIES_VOTE_FAIL:
      return { ...state, updateTreeSpeciesVoteLoading: false, updateTreeSpeciesVoteError: 'There was an error while updating a species vote' };
    default:
      return state;
  }
}

export function createTreeSpeciesVote(treeId, userId, speciesId) {
  return {
    type: CREATE_TREE_SPECIES_VOTE,
    payload: {
      request: {
        method: 'post',
        url: '/treespeciesvote/',
        data: {
          tree_id: treeId,
          user_id: userId,
          species_id: speciesId,
        },
      },
    },
  };
}

export function updateTreeSpeciesVote(speciesId, treeSpeciesVoteId) {
  return {
    type: UPDATE_TREE_SPECIES_VOTE,
    payload: {
      request: {
        method: 'put',
        url: `/treespeciesvote/${treeSpeciesVoteId}`,
        data: {
          species_id: speciesId,
        },
      },
    },
  };
}
