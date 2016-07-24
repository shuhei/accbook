/* @flow */
import React from 'react';
import { connect } from 'react-redux';

import Main from './Main';
import LoginForm from './LoginForm';

import type { User } from '../types';

type Props = {
  user: User,
};

function App({ user }: Props) {
  return user ? (<Main />) : (<LoginForm />);
}

function select({ user }) {
  return { user };
}

export default connect(select)(App);
