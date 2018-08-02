import Request from '../utils/request';
import { ENDPOINT_USER_LOGIN, ENDPOINT_USER_LOGOUT, ENDPOINT_USERS } from '../constants';

export const register = async (credentials) => {
  const result = await Request.post(ENDPOINT_USERS, credentials, true);
  return result;
};

export const login = async (credentials) => {
  const result = await Request.post(ENDPOINT_USER_LOGIN, credentials, true);
  return result;
};

export const logout = async () => {
  const result = await Request.post(ENDPOINT_USER_LOGOUT);
  return result;
};
