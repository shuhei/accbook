/* @flow */
import { createAction } from 'redux-actions';

import * as webapi from './webapi';

// Action creators
export const signup = createAction('SIGNUP', webapi.signup);
export const login = createAction('LOGIN', webapi.login);
export const logout = createAction('LOGOUT', webapi.logout);
export const checkCurrentUser = createAction('CURRENT_USER', webapi.currentUser);

export const newItem = createAction('NEW_ITEM');
export const editItem = createAction('EDIT_ITEM');

export const editBudget = createAction('EDIT_BUDGET');
export const newBudget = createAction('NEW_BUDGET');

export const closeBudgetForm = createAction('CLOSE_BUDGET_FORM');
export const closeForm = createAction('CLOSE_ITEM_FORM');

export const toggleMenu = createAction('TOGGLE_MENU');
