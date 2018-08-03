import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultHeader from './DefaultHeader';

import { User } from '../../utils/user';
import Toastr from 'toastr';

// import socket lib
import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

Toastr.options.timeOut = 0;
Toastr.options.closeButton = true;
Toastr.options.extendedTimeOut = 0;
Toastr.options.progressBar = true;
Toastr.options.positionClass = 'toast-top-right';

const role = User.role();
const user = User.getCurrent() || {};
const socket = io.connect('http://localhost:8800');

socket.on('connect', async () => {
  // authenticates
  const token = User.getToken();
  socket.emit('authenticate', {accessToken: token});
});

socket.on('reconnect', async () => {
  // authenticates
  const token = User.getToken();
  socket.emit('authenticate', {accessToken: token});
});

// authenticated
socket.on('authenticated', () => {
  if(role == "customer") {
    socket.emit('join', (user.id + '/track-transaction'));
  } else {
    socket.emit('join', 'new-transaction');
  }
});

socket.on('new-transaction', data => {
  Toastr.success(
    'Notice!',
    `You have a new order #${data.tranCode}`
  )
})

socket.on((user.id + '/track-transaction'), data => {
  const transactionStatus = {
    "-1" : "REJECTED",
    0: "PENDING",
    1: "PROCESSING",
    2: "DONE"
  }

  Toastr.success(
    'Notice!',
    `Your order #${data.tranCode} has been changed status to "${transactionStatus[data.status]}"`
  )
})

class DefaultLayout extends Component {
  render() {
    return (
      <SocketProvider socket={socket}>
        <div className="app">
          <AppHeader fixed>
            <DefaultHeader />
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <AppSidebarNav navConfig={navigation} {...this.props} />
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes}/>
              <Container fluid>
                <Switch>
                  {routes.map((route, idx) => {
                      return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                          <route.component {...props} />
                        )} />)
                        : (null);
                    },
                  )}
                  <Redirect from="/" to="/transaction" />
                </Switch>
              </Container>
            </main>
            <AppAside fixed hidden>
              <DefaultAside />
            </AppAside>
          </div>
        </div>
      </SocketProvider>
    );
  }
}

export default DefaultLayout;
