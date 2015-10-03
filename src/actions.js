import { createAction } from 'redux-actions';

import {
  login as loginApi,
  fetchItems as fetchItemsApi
} from './webapi';

// Constants
export const LOGIN = 'LOGIN';

export const NEW_ITEM = 'NEW_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const SAVE_ITEM = 'SAVE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const FETCH_ITEMS = 'FETCH_ITEMS';

export const CLOSE_FORM = 'CLOSE_FORM';
export const TOGGLE_MENU = 'TOGGLE_MENU';

// Action creators
export const login = createAction(LOGIN, loginApi);

export const newItem = createAction(NEW_ITEM);
export const editItem = createAction(EDIT_ITEM);
export const deleteItem = createAction(DELETE_ITEM);
export const saveItem = createAction(SAVE_ITEM);

const fetchItems = createAction(FETCH_ITEMS, fetchItemsApi);

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
