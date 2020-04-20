import axios from 'axios';
import {
  AUTH_REGISTER,
  AUTH_REGISTER_FAILURE,
  AUTH_REGISTER_SUCCESS,
  AUTH_LOGIN,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_SUCCESS,
  AUTH_GET_STATUS,
  AUTH_GET_STATUS_FAILURE,
  AUTH_GET_STATUS_SUCCESS,
  AUTH_LOGOUT,
} from './ActionTypes';

/* REGISTER */
export function registerRequest(username, password) {
  return (dispatch) => {
    dispatch(register());

    return axios
      .post('/api/account/signup', { username, password })
      .then((res) => {
        dispatch(registerSuccess());
      })
      .catch((err) => {
        dispatch(registerFailure(err.response.data.code));
      });
  };
}

export function register() {
  return {
    type: AUTH_REGISTER,
  };
}
export function registerSuccess() {
  return {
    type: AUTH_REGISTER_SUCCESS,
  };
}

export function registerFailure(error) {
  return {
    type: AUTH_REGISTER_FAILURE,
    error,
  };
}

/** LOGIN */
export function loginRequest(username, password) {
  return (dispatch) => {
    dispatch(login());

    return axios
      .post('/api/account/signin', { username, password })
      .then((res) => dispatch(loginSuccess(username)))
      .catch((err) => dispatch(loginFailure()));
  };
}

export function login() {
  return { type: AUTH_LOGIN };
}

export function loginSuccess(username) {
  return {
    type: AUTH_LOGIN_SUCCESS,
    username,
  };
}

export function loginFailure() {
  return {
    type: AUTH_LOGIN_FAILURE,
  };
}

/** GET STATUS */
export function getStatusRequest() {
  return (dispatch) => {
    dispatch(getStatus());

    return axios
      .get('/api/account/getInfo')
      .then((res) => dispatch(getStatusSuccess(res.data.info.username)))
      .catch((err) => dispatch(getStatusFailure()));
  };
}

export function getStatus() {
  return {
    type: AUTH_GET_STATUS,
  };
}

export function getStatusSuccess(username) {
  return {
    type: AUTH_GET_STATUS_SUCCESS,
    username,
  };
}

export function getStatusFailure() {
  return {
    type: AUTH_GET_STATUS_FAILURE,
  };
}

/** LOGOUT */
export function logoutRequest() {
  return (dispatch) => {
    return axios.post('/api/account/logout').then((res) => dispatch(logout()));
  };
}

export function logout() {
  return {
    type: AUTH_LOGOUT,
  };
}
