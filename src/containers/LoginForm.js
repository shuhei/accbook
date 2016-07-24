/* @flow */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { signup, login } from '../actions';

class LoginForm extends Component {
  getAuth() {
    const username = findDOMNode(this.refs.username).value;
    const password = findDOMNode(this.refs.password).value;
    return { username, password };
  }

  handleSignup() {
    const { dispatch } = this.props;
    dispatch(signup(this.getAuth()));
  }

  handleLogin() {
    const { dispatch } = this.props;
    dispatch(login(this.getAuth()));
  }

  render() {
    return (
      <form className="form login-form">
        <h1>accbook</h1>

        <input type="text" className="input--large" placeholder="Username" ref="username" />
        <input type="password" className="input--large" placeholder="Password" ref="password" />

        <button
          type="button"
          className="button button--secondary button--large"
          onClick={() => this.handleSignup()}
        >Sign up</button>
        <button
          type="button"
          className="button button--primary button--large"
          onClick={() => this.handleLogin()}
        >Log in</button>
      </form>
    );
  }
}

export default connect()(LoginForm);
