export const API_URL = 'http://localhost:4000/api';
export const TOKEN_INVALID_CODE = 'INVALID_TOKEN';
export const AUTHORIZATION_REQUIRED_CODE = 'AUTHORIZATION_REQUIRED';

//APP URLS
export const PRODUCTS_URL = '/products';
export const PRODUCT_DETAIL = id => `/products/${id}/detail`;
export const ADD_PRODUCT_URL = '/products/add';
export const EDIT_PRODUCT_URL = id => `/products/${id}/edit`;

//API ENDPOINTS
export const ENDPOINT_USERS = '/users';
export const ENDPOINT_USER_LOGIN = `${ENDPOINT_USERS}/login`;
export const ENDPOINT_USER_LOGOUT = `${ENDPOINT_USERS}/logout`;
export const ENDPOINT_CATEGORIES = '/categories';
export const ENDPOINT_PRODUCTS = categoryId => `${ENDPOINT_CATEGORIES}/${categoryId}/products`;
export const ENDPOINT_UPLOAD_IMAGE = '/upload-image';
export const ENDPOINT_TRANSACTIONS = '/transactions';
export const ENDPOINT_TABLES = '/tables';
