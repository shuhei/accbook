import { combineReducers } from 'redux';

import {
  TOGGLE_MENU,
  FETCH_ITEMS, NEW_ITEM, EDIT_ITEM, SAVE_ITEM, DELETE_ITEM,
  CLOSE_FORM
} from './actions';

function menuOpen(state = false, { type }) {
  switch (type) {
    case TOGGLE_MENU:
      return !state;
    default:
      return state;
  }
}

function form(state = { open: false, item: null }, { type, payload }) {
  switch (type) {
    case NEW_ITEM: {
      const item = {
        isChecked: false,
        amount: 0,
        label: '',
        date: new Date()
      };
      return { open: true, item };
    }
    case EDIT_ITEM: {
      const item = {
        uid: payload.uid,
        isChecked: payload.amount > 0,
        amount: Math.abs(payload.amount),
        label: payload.label,
        date: payload.date
      };
      return { open: true, item };
    }
    case SAVE_ITEM:
      return { open: false, item: null };
    case CLOSE_FORM:
      return { open: false, item: null };
    default:
      return state;
  }
}

function generateUid() {
  return Math.abs(Math.random() * 100000000).toString();
}

function createItem(items, item) {
  return items.concat({ ...item, uid: generateUid() });
}

function updateItem(items, item) {
  return items.map((x) => x.uid === item.uid ? item : x);
}

function validateItem(item) {
  const { uid, isIncome, amount, label, date } = item;
  const parsed = parseInt(amount || '0', 10) * (isIncome ? 1 : -1);
  return {
    uid, label, date, amount: parsed
  };
}

function budgetItems(state = [], { type, payload, error }) {
  switch (type) {
    case FETCH_ITEMS: {
      if (error) {
        console.error('Failed to fetch items', payload);
        return state;
      } else {
        return payload.reduce(createItem, state);
      }
    }
    case SAVE_ITEM: {
      const item = validateItem(payload);
      if (item.uid) {
        return updateItem(state, item);
      } else {
        return createItem(state, item);
      }
    }
    case DELETE_ITEM:
      return state.filter((item) => item.uid !== payload.uid);
    default:
      return state;
  }
}

const reducers = combineReducers({
  budgetItems,
  menuOpen,
  form
});

export default reducers;
