/* @flow */
import React from 'react';
import { reduxForm, Field } from 'redux-form';

import { login, signup } from '../actions';

const LOGIN = 'login';
const SIGNUP = 'signup';

type RadioProps = {
  input: {
    value: string,
    onChange: Function,
  },
};
const FormTypeRadio = ({ input: { value, onChange } }: RadioProps) => (
  <div>
    <label className="text-large">
      <input
        type="radio"
        className="text-large"
        checked={value === LOGIN}
        onChange={() => onChange(LOGIN)}
      />
      Log in
    </label>
    <label className="text-large">
      <input
        type="radio"
        className="text-large"
        checked={value === SIGNUP}
        onChange={() => onChange(SIGNUP)}
      />
      Sign up
    </label>
  </div>
);

type Props = {
  handleSubmit: Function,
};
const LoginForm = ({ handleSubmit }: Props) => (
  <form className="form login-form" onSubmit={handleSubmit}>
    <h1>accbook</h1>

    <Field
      name="username"
      component="input"
      type="text"
      className="text-large"
      placeholder="Username"
    />
    <Field
      name="password"
      component="input"
      type="password"
      className="text-large"
      placeholder="Password"
    />
    <Field
      name="formType"
      component={FormTypeRadio}
    />

    <button type="submit" className="button button--primary button--large">
      Go
    </button>
  </form>
);

export default reduxForm({
  form: 'login',
  initialValues: {
    formType: LOGIN,
  },
  onSubmit({ username, password, formType }, dispatch) {
    switch (formType) {
      case LOGIN:
        return dispatch(login({ username, password }));
      case SIGNUP:
        return dispatch(signup({ username, password }));
      default:
        return Promise.resolve();
    }
  },
})(LoginForm);
