/* @flow */
/* eslint no-console: "off" */
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import modal from './modules/modal';
import budgets from './modules/budgets';
import budgetItems from './modules/budgetItems';

import type {
  Action,
  User,
} from './types';

export function user(state: ?User = null, action: Action): ?Object {
  switch (action.type) {
    case 'LOGIN':
      if (action.error) {
        console.error('Failed to login');
        return null;
      }
      return action.payload;
    case 'LOGOUT':
      return null;
    case 'CURRENT_USER':
      if (action.error) {
        console.log('Failed to get current user', action.payload);
        return null;
      }
      return action.payload;
    default:
      return state;
  }
}

export function menuOpen(state: boolean = false, { type }: Action): boolean {
  switch (type) {
    case 'TOGGLE_MENU':
      return !state;
    default:
      return state;
  }
}

export function selectedBudgetId(state: ?string = null, action: Action): ?string {
  switch (action.type) {
    case 'BUDGET_SELECTED':
      return action.budget.id;
    default:
      return state;
  }
}

const ui = combineReducers({
  modal,
});

const reducers = combineReducers({
  user,
  budgets,
  budgetItems,

  ui,

  selectedBudgetId,
  menuOpen,

  form: formReducer,
});

export default reducers;
