import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {
  Button, Card, CardBody, CardFooter, Col, Container, FormFeedback,
  Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row,
} from 'reactstrap';
import { register } from '../../services/AuthServices.js';
import { User } from '../../utils/user';
class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      repeatPassword: '',
      error: null,
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  onInputChange(e, field) {
    this.setState({ [field]: e.target.value });
  }

  validate() {
    const { username, password, repeatPassword } = this.state;
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
    if(password !== repeatPassword) {
      return {
        key: 'repeatPassword',
        message: 'Password does not match.'
      };
    }
    this.setState({ error: null });
    return null;
  }

  handleRegister = async e => {
    e.preventDefault();
    const error = this.validate();
    if (error) {
      this.setState({ error });
      return error;
    }
    const { username, password } = this.state;
    const credentials = { username, password };
    try {
      const user = await register(credentials);
      if(user) {
        User.store(user);
        window.location.href = '/app/dashboard';
      }
    } catch (e) {
      console.log(e)
    }
  }
  render() {
    const { error } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form onSubmit={this.handleRegister}>
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>
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
                    <InputGroup className="mb-3">
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
                      { (error && error.key === "password") && (
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
                        placeholder="Repeat Password"
                        onChange={(e) => this.onInputChange(e, 'repeatPassword')}
                        invalid={error && error.key === 'repeatPassword'}
                      />
                      { (error && error.key === "repeatPassword") && (
                        <FormFeedback>{error.message}</FormFeedback>
                      )}
                    </InputGroup>
                    <Button className="mb-3" color="success" block onClick={this.handleRegister}>Create Account</Button>
                  </Form>
                  <Link to="/login">Already have an account? Let's login</Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
