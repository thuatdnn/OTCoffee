import React from 'react';
import Loadable from 'react-loadable'

import { DefaultLayout, CustomerLayout } from './containers';

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
const Staff = Loadable({
  loader: () => import('./pages/Staff'),
  loading: Loading,
});


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/table', name: 'Table', component: Table },
  { path: '/product', name: 'Product', component: Product },
  { path: '/transaction', name: 'Transaction', component: Transaction },
  { path: '/add-transaction', name: 'Add Transaction', component: AddTransaction },
  { path: '/staff', name: 'Staff', component: Staff },
];

export default routes;