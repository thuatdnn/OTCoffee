import axios from 'axios';
import Toastr from 'toastr';
import 'toastr/build/toastr.css';
import { API_URL, TOKEN_INVALID_CODE } from '../constants';
import { User } from './user';

Toastr.options.progressBar = true;
Toastr.options.positionClass = 'toast-bottom-right';

const request = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  responseType: 'json',
});

const fileEndpoint = `/files/container/upload`;


function handleRes(response) {
  return response.data;
}

function handleError(response) {
  if (!response.response) {
    Toastr.error('Something went wrong.', 'An Error Occurred!');
    throw response.error;
  }
  const error = response.response.data.error;
  Toastr.error(error.message, 'An Error Occurred!');
  if (error.status === 401 && error.code === TOKEN_INVALID_CODE) {
    window.sessionStorage.setItem('lastPath', window.location.pathname);
    window.location.href = '/login';
  }
  throw error;
}

function initHeader(noAuth, isFormData) {
  const headers = Object.assign(
    {},
    {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
    !noAuth && { Authorization: `Bearer ${User.getToken()}` },
);

  return headers;
}

export default class Request {
  static request = request

  static async post(endpoint, data, noAuth = false) {
    const headers = initHeader(noAuth);
    try {
      const response = await request.post(endpoint, data, { headers });
      return handleRes(response);
    } catch (e) {
      return handleError(e);
    }
  }

  static async put(endpoint, data, noAuth = false) {
    const headers = initHeader(noAuth);
    try {
      const response = await request.put(endpoint, data, { headers });
      return handleRes(response);
    } catch (e) {
      return handleError(e);
    }
  }

  static async delete(endpoint, noAuth = false) {
    const headers = initHeader(noAuth);
    try {
      const response = await request.delete(endpoint, { headers });
      return handleRes(response);
    } catch (e) {
      return handleError(e);
    }
  }

  static async patch(endpoint, data, noAuth = false) {
    const headers = initHeader(noAuth);
    try {
      const response = await request.patch(endpoint, data, { headers });
      return handleRes(response);
    } catch (e) {
      return handleError(e);
    }
  }

  static async get(endpoint, params, noAuth = false) {
    const headers = initHeader(noAuth);
    try {
      const response = await request.get(endpoint, { params, headers });
      return handleRes(response);
    } catch (e) {
      return handleError(e);
    }
  }

  static async upload(data, onUploadProgress, noAuth = false) {
    const headers = initHeader(noAuth, true);
    try {
      const response = await request.post(fileEndpoint, data, { headers, onUploadProgress });
      const { result } = response.data;
      return result;
    } catch (e) {
      return handleError(e);
    }
  }
}
