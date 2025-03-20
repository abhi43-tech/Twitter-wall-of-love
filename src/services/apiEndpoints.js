const BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${BASE_URL}/user/signup`,
  LOGIN: `${BASE_URL}/user/login`,
  GET_USER: `${BASE_URL}/user`,
  REQUEST_RESET_PASSWORD: `${BASE_URL}/user/reset-password/request`,
  RESET_PASSWORD: `${BASE_URL}/user/reset-password`,
  LOGOUT: `${BASE_URL}/user/logout`,
  UPDATE_USER: `${BASE_URL}/user`,
  DELETE_USER: `${BASE_URL}/user`,
  GENERATE_API_TOKEN: `${BASE_URL}/user/generate-api-token`,
  RESEND_VERIFICATION_EMAIL: `${BASE_URL}/user/resend-verification-email`,
  VERIFY_EMAIL: `${BASE_URL}/user/verify-email`,

  // Wall endpoints
  CREATE_WALL: `${BASE_URL}/walls`,
  GET_ALL_WALLS: `${BASE_URL}/walls`,
  GET_PUBLIC_WALLS_BY_USER: (userId) => `${BASE_URL}/users/${userId}/walls/public`,
  GET_WALL_BY_ID: (wallId) => `${BASE_URL}/walls/${wallId}`,
  UPDATE_WALL: (wallId) => `${BASE_URL}/walls/${wallId}`,
  DELETE_WALL: (wallId) => `${BASE_URL}/walls/${wallId}`,
  GENERATE_SHARABLE_LINK: (wallID) => `${BASE_URL}/walls/${wallID}/sharable-link`,
  GET_PUBLIC_WALL: (wallId) => `${BASE_URL}/walls/${wallId}/public`,
  GET_EMBED_CODE: (wallId) => `${BASE_URL}/walls/${wallId}/embed-code`,

  // Tweet endpoints
  CREATE_TWEET: (wallId) => `${BASE_URL}/walls/${wallId}/tweets`,
  GET_TWEETS_BY_WALL: (wallId) => `${BASE_URL}/walls/${wallId}/tweets`,
  DELETE_TWEET: (wallId, tweetId) => `${BASE_URL}/walls/${wallId}/tweets/${tweetId}`,
  REORDER_TWEETS: (wallId) => `${BASE_URL}/walls/${wallId}/tweets/reorder`,

  // Social links endpoints
  DELETE_SOCIAL_LINK: (wallId, linkId) => `${BASE_URL}/walls/${wallId}/social-links/${linkId}`,
};