import cookies from './cookies';

export const User = {
  store: (user) => {
    cookies.set('accesstoken', user.accessToken, { path: '/' });
    cookies.set('user', user, { path: '/' });
  },
  getCurrent: () => {
    const user = cookies.get('user');
    return user;
  },
  getToken: () => {
    const token = cookies.get('accesstoken');
    return token;
  },
  remove: () => {
    cookies.remove('accesstoken');
    cookies.remove('user');
  },
  role: () => {
    const user = cookies.get('user');
    return user ? user.role : null;
  }
}