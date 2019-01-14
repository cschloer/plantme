export const GET_POSTS = 'treemap/post/GET_POSTS';
export const GET_POSTS_SUCCESS = 'treemap/post/GET_POSTS_SUCCESS';
export const GET_POSTS_FAIL = 'treemap/post/GET_POSTS_FAIL';

export const CREATE_POST = 'treemap/post/CREATE_POST';
export const CREATE_POST_SUCCESS = 'treemap/post/CREATE_POST_SUCCESS';
export const CREATE_POST_FAIL = 'treemap/post/CREATE_POST_FAIL';

const defaultState = {
  posts: [],
  getPostsLoading: false,
  getPostsError: false,
  createPostLoading: false,
  createPostError: false,
};

export default function postReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_POSTS:
      return { ...state, getPostsLoading: true, getPostsError: false };
    case GET_POSTS_SUCCESS:
      return { ...state, getPostsLoading: false, posts: action.payload.data };
    case GET_POSTS_FAIL:
      return { ...state, getPostsLoading: false, getPostsError: 'There was an error while getting posts' };
    case CREATE_POST:
      return { ...state, createPostLoading: true, createPostError: false };
    case CREATE_POST_SUCCESS:
      return { ...state, createPostLoading: false };
    case CREATE_POST_FAIL:
      return { ...state, createPostLoading: false, createPostError: 'There was an error while creating a post' };
    default:
      return state;
  }
}

export function getPosts() {
  return {
    type: GET_POSTS,
    payload: {
      request: {
        method: 'get',
        url: '/post/',
      },
    },
  };
}

export function createPost(treeId, userId) {
  return {
    type: CREATE_POST,
    payload: {
      request: {
        method: 'post',
        url: '/post/',
        data: {
          tree_id: treeId,
          user_id: userId,
        },
      },
    },
  };
}
