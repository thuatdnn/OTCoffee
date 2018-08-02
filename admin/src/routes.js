import React from 'react';
import Loadable from 'react-loadable'

import DefaultLayout from './containers/DefaultLayout';

function Loading() {
  return <div>Loading...</div>;
}

const Dashboard = Loadable({
  loader: () => import('./pages/Dashboard'),
  loading: Loading,
});
const Table = Loadable({
  loader: () => import('./pages/Table'),
  loading: Loading,
});
const Product = Loadable({
  loader: () => import('./pages/Product'),
  loading: Loading,
});
const Transaction = Loadable({
  loader: () => import('./pages/Transaction'),
  loading: Loading,
});
const AddTransaction = Loadable({
  loader: () => import('./pages/AddTransaction'),
  loading: Loading,
});

const Users = Loadable({
  loader: () => import('./views/Users/Users'),
  loading: Loading,
});

const User = Loadable({
  loader: () => import('./views/Users/User'),
  loading: Loading,
});



// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/table', name: 'Table', component: Table },
  { path: '/product', name: 'Product', component: Product },
  { path: '/transaction', name: 'Transaction', component: Transaction },
  { path: '/add-transaction', name: 'AddTransaction', component: AddTransaction },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
