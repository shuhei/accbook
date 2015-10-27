import { createAction } from 'redux-actions';

import * as webapi from './webapi';

// Constants
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const CURRENT_USER = 'CURRENT_USER';

export const FETCH_BUDGETS = 'FETCH_BUDGETS';
export const SAVE_BUDGET = 'SAVE_BUDGET';
export const DELETE_BUDGET = 'DELETE_BUDGET';
export const SELECT_BUDGET = 'SELECT_BUDGET';
export const NEW_BUDGET = 'NEW_BUDGET';
export const EDIT_BUDGET = 'EDIT_BUDGET';

export const NEW_ITEM = 'NEW_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const SAVE_ITEM = 'SAVE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const FETCH_ITEMS = 'FETCH_ITEMS';

export const CLOSE_BUDGET_FORM = 'CLOSE_BUDGET_FORM';
export const CLOSE_ITEM_FORM = 'CLOSE_ITEM_FORM';

export const TOGGLE_MENU = 'TOGGLE_MENU';

// Action creators
export const signup = createAction(SIGNUP, webapi.signup);
export const login = createAction(LOGIN, webapi.login);
export const logout = createAction(LOGOUT, webapi.logout);
export const checkCurrentUser = createAction(CURRENT_USER, webapi.currentUser);

export const newItem = createAction(NEW_ITEM);
export const editItem = createAction(EDIT_ITEM);
export const deleteItem = createAction(DELETE_ITEM, webapi.deleteItem);

export const editBudget = createAction(EDIT_BUDGET);
export const newBudget = createAction(NEW_BUDGET);

const saveItemPlain = createAction(SAVE_ITEM, webapi.saveItem);

export function saveItem(item) {
  return (dispatch, getState) => {
    if (item.budgetId) {
      dispatch(saveItemPlain(item));
    } else {
      const budgetId = getState().selectedBudget.id;
      dispatch(saveItemPlain({ ...item, budgetId }));
    }
  };
}

const saveBudgetPlain = createAction(SAVE_BUDGET, webapi.saveBudget);

export function saveBudget(budget) {
  return (dispatch, getState) => {
    dispatch(saveBudgetPlain(budget));
  };
}

export const selectBudget = createAction(SELECT_BUDGET);

const fetchBudgets = createAction(FETCH_BUDGETS, webapi.fetchBudgets);
const fetchItems = createAction(FETCH_ITEMS, webapi.fetchItems);

function shouldFetchBudgets({ budgets }) {
  // TODO: Take care of loading state.
  return budgets.length === 0;
}

function shouldSelectBudget({ selectedBudget }) {
  return !selectedBudget;
}

export function fetchBudgetsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchBudgets(getState())) {
      dispatch(fetchBudgets()).then(({ payload: budgets }) => {
        if (shouldSelectBudget(getState())) {
          dispatch(selectBudget(budgets[0]));
        }
      });
    }
  };
}

function shouldFetchItems({ selectedBudget, budgetItems }) {
  // TODO: Take care of loading state.
  return budgetItems.length === 0;
}

export function fetchItemsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchItems(getState())) {
      dispatch(fetchItems());
    }
  };
}

export const closeBudgetForm = createAction(CLOSE_BUDGET_FORM);
export const closeForm = createAction(CLOSE_ITEM_FORM);

export const toggleMenu = createAction(TOGGLE_MENU);
