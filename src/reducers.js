import { combineReducers } from 'redux';
import { TOGGLE_MENU, NEW_ITEM, EDIT_ITEM, SAVE_ITEM, DELETE_ITEM, CLOSE_FORM } from './actions';

function menuOpen(state = false, action) {
  switch (action.type) {
    case TOGGLE_MENU:
      return !state;
    default:
      return state;
  }
}

function form(state = { open: false, item: null }, action) {
  switch (action.type) {
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
        uid: action.item.uid,
        isChecked: action.item.amount > 0,
        amount: Math.abs(action.item.amount),
        label: action.item.label,
        date: action.item.date
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

let currentUid = 0;
function createItem(items, item) {
  return items.concat(Object.assign({}, item, { uid: ++currentUid }));
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

const items = [
  { amount: 1000, label: 'hello', date: new Date() },
  { amount: -2300, label: 'minus', date: new Date() }
].reduce(createItem, []);

function budgetItems(state = items, action) {
  switch (action.type) {
    case SAVE_ITEM:
      const item = validateItem(action.item);
      if (item.uid) {
        return updateItem(state, item);
      } else {
        return createItem(state, item);
      }
    case DELETE_ITEM:
      return state.filter((item) => item.uid !== action.item.uid);
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
