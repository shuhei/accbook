import { createAction } from 'redux-actions';

import * as webapi from './webapi';

// Constants
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const CURRENT_USER = 'CURRENT_USER';

export const NEW_ITEM = 'NEW_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const SAVE_ITEM = 'SAVE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const FETCH_ITEMS = 'FETCH_ITEMS';

export const CLOSE_FORM = 'CLOSE_FORM';
export const TOGGLE_MENU = 'TOGGLE_MENU';

// Action creators
export const signup = createAction(SIGNUP, webapi.signup);
export const login = createAction(LOGIN, webapi.login);
export const logout = createAction(LOGOUT, webapi.logout);
export const checkCurrentUser = createAction(CURRENT_USER, webapi.currentUser);

export const newItem = createAction(NEW_ITEM);
export const editItem = createAction(EDIT_ITEM);
export const deleteItem = createAction(DELETE_ITEM, webapi.deleteItem);
export const saveItem = createAction(SAVE_ITEM, webapi.saveItem);

const fetchItems = createAction(FETCH_ITEMS, webapi.fetchItems);

function shouldFetchItems({ budgetItems }) {
  // TODO: Take care of loading state.
  if (budgetItems.length > 0) {
    return false;
  } else {
    return true;
  }
}

export function fetchItemsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchItems(getState())) {
      return dispatch(fetchItems());
    }
  };
}

export const closeForm = createAction(CLOSE_FORM);
export const toggleMenu = createAction(TOGGLE_MENU);
