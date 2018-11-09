export const SET_USER = 'plantme/login/SET_USER';

export default function loginReducer(state = { profile: {} }, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, profile: action.payload.profile };
    default:
      return state;
  }
}

export function setUserProfile(profile) {
  return {
    type: SET_USER,
    payload: {
      profile,
    },
  };
}
