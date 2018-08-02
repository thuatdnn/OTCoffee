import React, { Component } from 'react';
import { User } from './user';

const Authentication = (WrappedComponent) => {
  class AuthComponent extends Component {
    componentDidMount() {
      const { token } = this.props;
      if (!token) {
        global.window.location.href = '/login';
      }
    }

    static getInitialProps() {
      return { token: User.getToken() };
    }

    render() {
      const { token } = this.props;
      if (!token) {
        return <div />;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  return AuthComponent;
};

export default Authentication;
