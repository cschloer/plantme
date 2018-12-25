export const GET_USER_PLANTS = 'plantme/user_plant/GET_USER_PLANTS';
export const GET_USER_PLANTS_SUCCESS = 'plantme/user_plant/GET_USER_PLANTS_SUCCESS';
export const GET_USER_PLANTS_FAIL = 'plantme/user_plant/GET_USER_PLANTS_FAIL';

export default function userPlantReducer(state = { plants: null, loading: false }, action) {
  switch (action.type) {
    case GET_USER_PLANTS:
      return { ...state, loading: true };
    case GET_USER_PLANTS_SUCCESS:
      return { ...state, loading: false, plants: action.payload.data };
    case GET_USER_PLANTS_FAIL:
      return { ...state, loading: false, error: 'Error while fetching plants' };
    default:
      return state;
  }
}

export function getUserPlants(userId) {
  console.log('Gotta get the plants of the userId', userId);
  return {
    type: GET_USER_PLANTS,
    payload: {
      request: {
        url: `/userplant?user_id=${userId}`,
      },
    },
  };
}
