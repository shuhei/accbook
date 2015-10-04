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
      <form className="pure-form">
        <fieldset>
          <legend>Log in</legend>
          <input type="text" ref="username" />
          <input type="password" ref="password" />
          <button onClick={this.handleLogin.bind(this)}>Log in</button>
          <button onClick={this.handleSignup.bind(this)}>Sign up</button>
        </fieldset>
      </form>
    );
  }
}

export default connect()(LoginForm);
