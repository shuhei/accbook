import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { signup, login } from '../actions';

class LoginForm extends Component {
  handleSignup() {
    const { dispatch } = this.props;
    dispatch(signup(this.getAuth()));
  }

  handleLogin() {
    const { dispatch } = this.props;
    dispatch(login(this.getAuth()));
  }

  getAuth() {
    const username = findDOMNode(this.refs.username).value;
    const password = findDOMNode(this.refs.password).value;
    return { username, password };
  }

  render() {
    return (
      <form className="form login-form">
        <h1>accbook</h1>
        <input type="text" placeholder="Username" ref="username" />
        <input type="password" placeholder="Password" ref="password" />
        <button className="button button--secondary" onClick={this.handleSignup.bind(this)}>Sign up</button>
        <button className="button button--primary" onClick={this.handleLogin.bind(this)}>Log in</button>
      </form>
    );
  }
}

export default connect()(LoginForm);
