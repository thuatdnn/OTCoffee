import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardGroup, Col, Container, Form,
  Input, InputGroup, InputGroupAddon, InputGroupText, Row, FormFeedback,
} from 'reactstrap';
import { login } from '../../services/AuthServices.js';
import { User } from '../../utils/user';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: null,
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.goSignup = this.goSignup.bind(this);
  }

  onInputChange(e, field) {
    this.setState({ [field]: e.target.value });
  }

  validate() {
    const { username, password } = this.state;
    if(!username) {
      return {
        key: 'username',
        message: 'Username is required.'
      };
    }
    if(!password) {
      return {
        key: 'password',
        message: 'Password is required.'
      };
    }
    this.setState({ error: null });
    return null;
  }

  handleLogin = async e => {
    e.preventDefault();
    const error = this.validate();
    if (error) {
      this.setState({ error });
      return error;
    }
    const { username, password } = this.state;
    const credentials = { username, password };
    try {
      const user = await login(credentials);
      if(user) {
        User.store(user);
        if(user.role === "admin" || user.role === "staff") {
          window.location.href = '/admin/dashboard';
        };
        window.location.href = '/';
      }
    } catch (e) {
      console.log(e)
    }
  }

  goSignup() {
    this.props.history.push('/register');
  }

  render() {
    const { error } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleLogin}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          required
                          placeholder="Username"
                          autoComplete="username"
                          onChange={(e) => this.onInputChange(e, 'username')}
                          invalid={error && error.key === 'username'}
                        />
                        { (error && error.key === "username") && (
                          <FormFeedback>{error.message}</FormFeedback>
                        )}
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          required
                          placeholder="Password"
                          autoComplete="current-password"
                          onChange={(e) => this.onInputChange(e, 'password')}
                          invalid={error && error.key === 'password'}
                        />
                        { (error && error.key === 'password') && (
                          <FormFeedback>{error.message}</FormFeedback>
                        )}
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4" onClick={this.handleLogin}>Login</Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua.</p>
                      <Button color="primary" className="mt-3" active onClick={this.goSignup}>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
