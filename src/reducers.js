import { combineReducers } from 'redux';

import {
  LOGIN, LOGOUT, CURRENT_USER,
  TOGGLE_MENU,
  FETCH_BUDGETS, SAVE_BUDGET, DELETE_BUDGET, SELECT_BUDGET,
  FETCH_ITEMS, NEW_ITEM, EDIT_ITEM, SAVE_ITEM, DELETE_ITEM,
  CLOSE_FORM
} from './actions';

export function user(state = null, { type, payload, error }) {
  switch (type) {
    case LOGIN:
      if (error) {
        console.error('Failed to login', payload);
        return null;
      } else {
        return payload;
      }
    case LOGOUT:
      return null;
    case CURRENT_USER:
      if (error) {
        console.log('Failed to get current user', payload);
        return null;
      } else {
        return payload;
      }
    default:
      return state;
  }
}

export function menuOpen(state = false, { type }) {
  switch (type) {
    case TOGGLE_MENU:
      return !state;
    default:
      return state;
  }
}

// TODO: loading and error?
export function form(state = { item: null, errors: {} }, { type, payload, error }) {
  switch (type) {
    case NEW_ITEM: {
      const item = {
        amount: 0,
        label: '',
        date: new Date()
      };
      return { ...state, item };
    }
    case EDIT_ITEM: {
      return { ...state, item: payload };
    }
    case SAVE_ITEM:
      if (error) {
        return state;
      } else {
        return { ...state, item: null };
      }
    case CLOSE_FORM:
      return { ...state, item: null };
    default:
      return state;
  }
}

export function selectedBudget(state = null, { type, payload }) {
  switch (type) {
    case SELECT_BUDGET:
      return payload;
    default:
      return state;
  }
}

// TODO: loading and error?
export function budgets(state = [], { type, payload, error }) {
  switch (type) {
    case FETCH_BUDGETS: {
      if (error) {
        console.error('Failed to fetch budgets', payload);
        return state;
      } else {
        return payload;
      }
    }
    case SAVE_BUDGET: {
      if (error) {
        console.error('Failed to save budget', payload);
        return state;
      } else {
        return state.concat(payload);
      }
    }
    case DELETE_BUDGET:
      if (error) {
        console.error('Failed to save budget', payload);
        return state;
      } else {
        return state.filter((budget) => budget.id !== payload.id);
      }
    default:
      return state;
  }
}

// TODO: loading and error?
// TODO: Use handleAction to destruct payload.
export function budgetItems(state = [], { type, payload, error }) {
  switch (type) {
    case FETCH_ITEMS: {
      if (error) {
        // TODO: Set error.
        console.error('Failed to fetch items', payload);
        return state;
      } else {
        return payload;
      }
    }
    case SAVE_ITEM: {
      if (error) {
        // TODO: Set error.
        console.error('Failed to save item', payload);
        return state;
      } else {
        if (state.filter((item) => item.id === payload.id).length > 0) {
          return state.map((item) => item.id === payload.id ? payload : item);
        } else {
          return state.concat([payload]);
        }
      }
    }
    case DELETE_ITEM:
      if (error) {
        console.error('Failed to delete item', payload);
        return state;
      } else {
        return state.filter((item) => item.id !== payload.id);
      }
    default:
      return state;
  }
}

const reducers = combineReducers({
  user,
  budgets,
  selectedBudget,
  budgetItems,
  menuOpen,
  form
});

export default reducers;
