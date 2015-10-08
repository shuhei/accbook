import React, { Component } from 'react';
import { connect } from 'react-redux';

import { checkCurrentUser } from '../actions';
import Main from './Main';
import LoginForm from './LoginForm';

class App extends Component {
  componentWillMount() {
    this.props.dispatch(checkCurrentUser());
  }

  render() {
    const { user } = this.props;
    return user ? (<Main />) : (<LoginForm />);
  }
}

function select({ user }) {
  return { user };
}

export default connect(select)(App);
