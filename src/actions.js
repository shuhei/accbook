import { createAction } from 'redux-actions';

import type {
  Action,
  Budget,
  BudgetForm,
  BudgetItem,
  BudgetItemForm
} from './types';
import * as webapi from './webapi';

// Action creators
export const signup = createAction('SIGNUP', webapi.signup);
export const login = createAction('LOGIN', webapi.login);
export const logout = createAction('LOGOUT', webapi.logout);
export const checkCurrentUser = createAction('CURRENT_USER', webapi.currentUser);

export const newItem = createAction('NEW_ITEM');
export const editItem = createAction('EDIT_ITEM');
export const deleteItem = createAction('DELETE_ITEM', webapi.deleteItem);

export const editBudget = createAction('EDIT_BUDGET');
export const newBudget = createAction('NEW_BUDGET');

const saveItemPlain = createAction('SAVE_ITEM', webapi.saveItem);

export function saveItem(item) {
  return (dispatch, getState) => {
    if (item.budgetId) {
      dispatch(saveItemPlain(item));
    } else {
      const budgetId = getState().selectedBudgetId;
      dispatch(saveItemPlain({ ...item, budgetId }));
    }
  };
}

export const closeBudgetForm = createAction('CLOSE_BUDGET_FORM');
export const closeForm = createAction('CLOSE_ITEM_FORM');

export const toggleMenu = createAction('TOGGLE_MENU');
