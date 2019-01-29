import { LOGOUT } from './login';

export const GET_POSTS = 'treemap/post/GET_POSTS';
export const GET_POSTS_SUCCESS = 'treemap/post/GET_POSTS_SUCCESS';
export const GET_POSTS_FAIL = 'treemap/post/GET_POSTS_FAIL';

export const GET_SINGLE_POST = 'treemap/post/GET_SINGLE_POST';
export const GET_SINGLE_POST_SUCCESS = 'treemap/post/GET_SINGLE_POST_SUCCESS';
export const GET_SINGLE_POST_FAIL = 'treemap/post/GET_SINGLE_POST_FAIL';

export const GET_USER_POSTS = 'treemap/post/GET_USER_POSTS';
export const GET_USER_POSTS_SUCCESS = 'treemap/post/GET_USER_POSTS_SUCCESS';
export const GET_USER_POSTS_FAIL = 'treemap/post/GET_USER_POSTS_FAIL';

export const CREATE_POST = 'treemap/post/CREATE_POST';
export const CREATE_POST_SUCCESS = 'treemap/post/CREATE_POST_SUCCESS';
export const CREATE_POST_FAIL = 'treemap/post/CREATE_POST_FAIL';

export const CREATE_POST_COMMENT = 'treemap/post_comment/CREATE_POST_COMMENT';
export const CREATE_POST_COMMENT_SUCCESS = 'treemap/post_comment/CREATE_POST_COMMENT_SUCCESS';
export const CREATE_POST_COMMENT_FAIL = 'treemap/post_comment/CREATE_POST_COMMENT_FAIL';

const defaultState = {
  posts: null,
  getPostsLoading: false,
  getPostsError: false,
  userPosts: null,
  getUserPostsLoading: false,
  getUserPostsError: false,
  singlePost: null,
  getSinglePostLoading: false,
  getSinglePostError: false,
  createPostLoading: false,
  createPostError: false,
  createPostCommentLoading: false,
  createPostCommentError: false,
};

export default function postReducer(state = defaultState, action) {
  switch (action.type) {
    case GET_POSTS:
      return { ...state, getPostsLoading: true, getPostsError: false };
    case GET_POSTS_SUCCESS:
      return { ...state, getPostsLoading: false, posts: action.payload.data };
    case GET_POSTS_FAIL:
      return { ...state, getPostsLoading: false, getPostsError: 'There was an error while getting posts' };
    case GET_USER_POSTS:
      return { ...state, getUserPostsLoading: true, getUserPostsError: false };
    case GET_USER_POSTS_SUCCESS:
      return { ...state, getUserPostsLoading: false, userPosts: action.payload.data };
    case GET_USER_POSTS_FAIL:
      return { ...state, getUserPostsLoading: false, getUserPostsError: 'There was an error while getting your posts' };
    case GET_SINGLE_POST:
      return { ...state, getSinglePostLoading: true, getSinglePostError: false };
    case GET_SINGLE_POST_SUCCESS:
      return { ...state, getSinglePostLoading: false, singlePost: action.payload.data };
    case GET_SINGLE_POST_FAIL:
      return { ...state, getSinglePostLoading: false, getSinglePostError: 'There was an error while getting a post' };
    case LOGOUT:
      return { ...state, userPosts: [] };
    case CREATE_POST:
      return { ...state, createPostLoading: true, createPostError: false };
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        createPostLoading: false,
        posts: state.posts
          ? [action.payload.data, ...state.posts] : [action.payload.data],
        userPosts: state.userPosts
          ? [action.payload.data, ...state.userPosts] : [action.payload.data],
      };
    case CREATE_POST_FAIL:
      return { ...state, createPostLoading: false, createPostError: 'There was an error while creating a post' };
    case CREATE_POST_COMMENT:
      return { ...state, createPostCommentLoading: true, createPostCommentError: false };
    case CREATE_POST_COMMENT_SUCCESS:
      return {
        ...state,
        createPostCommentLoading: false,
        posts: state.posts.map(post => {
          if (post.id === action.payload.data.post_id) {
            return {
              ...post,
              comments: [...post.comments, action.payload.data],
            };
          }
          return post;
        }),
        userPosts: state.userPosts.map(post => {
          if (post.id === action.payload.data.post_id) {
            return {
              ...post,
              comments: [...post.comments, action.payload.data],
            };
          }
          return post;
        }),
        singlePost: state.singlePost.id === action.payload.data.post_id
          ? {
            ...state.singlePost,
            comments: [...state.singlePost.comments, action.payload.data],
          } : state.singlePost,
      };
    case CREATE_POST_COMMENT_FAIL:
      return { ...state, createPostCommentLoading: false, createPostCommentError: 'There was an error while creating a comment' };
    default:
      return state;
  }
}

export function getUserPosts(userId, params = {}) {
  const paramString = Object.keys(params).reduce(
    (acc, param) => `${acc}&${param}=${params[param]}`,
    `?user_id=${userId}`,
  );
  return {
    type: GET_USER_POSTS,
    payload: {
      request: {
        method: 'get',
        url: `/post/${paramString}`,
      },
    },
  };
}

export function getPosts(params = {}) {
  const paramString = Object.keys(params).reduce(
    (acc, param) => `${acc}&${param}=${params[param]}`,
    '?',
  );
  return {
    type: GET_POSTS,
    payload: {
      request: {
        method: 'get',
        url: `/post/${paramString}`,
      },
    },
  };
}

export function getSinglePost(postId) {
  return {
    type: GET_SINGLE_POST,
    payload: {
      request: {
        method: 'get',
        url: `/post/${postId}`,
      },
    },
  };
}

export function createPost(form) {
  return {
    type: CREATE_POST,
    payload: {
      request: {
        method: 'post',
        url: '/post/',
        data: form,
      },
    },
  };
}

export function createPostComment(postId, userId, text) {
  return {
    type: CREATE_POST_COMMENT,
    payload: {
      request: {
        method: 'post',
        url: '/postcomment/',
        data: {
          post_id: postId,
          user_id: userId,
          text,
        },
      },
    },
  };
}
