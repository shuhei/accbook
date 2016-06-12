/* @flow */
import { combineReducers } from 'redux';

import type {
  Action,
  Budget,
  BudgetForm,
  BudgetItem,
  BudgetItemForm,
  User
} from './types';

export function user(state: ?User = null, action: Action): ?Object {
  switch (action.type) {
    case 'LOGIN':
      if (action.error) {
        console.error('Failed to login');
        return null;
      } else {
        return action.payload;
      }
    case 'LOGOUT':
      return null;
    case 'CURRENT_USER':
      if (action.error) {
        console.log('Failed to get current user', action.payload);
        return null;
      } else {
        return action.payload;
      }
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

export function budgetForm(state: BudgetForm = { budget: null, errors: {} }, action: Action): BudgetForm {
  switch (action.type) {
    case 'BUDGET_SAVE_SUCCEEDED':
      return { budget: null, errors: {} };
    case 'EDIT_BUDGET':
      return { budget: action.payload, errors: {} };
    case 'CLOSE_BUDGET_FORM':
      return { budget: null, errors: {} };
    default:
      return state;
  }
}

// TODO: loading and error?
export function budgetItemForm(state: BudgetItemForm = { item: null, errors: {} }, action: Action): BudgetItemForm {
  switch (action.type) {
    case 'NEW_ITEM': {
      const item = {
        id: null,
        amount: 0,
        label: '',
        date: new Date()
      };
      return { item, errors: {} };
    }
    case 'EDIT_ITEM': {
      return { item: action.payload, errors: {} };
    }
    case 'BUDGET_ITEM_SAVE_SUCCEEDED':
      return { item: null, errors: {} };
    case 'DELETE_ITEM':
      if (action.error) {
        // TODO: Add error.
        return state;
      } else {
        return { item: null, errors: {} };
      }
    case 'CLOSE_ITEM_FORM':
      return { item: null, errors: {} };
    default:
      return state;
  }
}

export function selectedBudgetId(state: ?number = null, action: Action): ?number {
  switch (action.type) {
    case 'BUDGET_SELECTED':
      return action.budget.id;
    default:
      return state;
  }
}

// TODO: loading and error?
export function budgets(state: Budget[] = [], action: Action): Budget[] {
  switch (action.type) {
    case 'BUDGETS_FETCH_SUCCEEDED':
      return action.budgets;
    case 'BUDGETS_FETCH_FAILED':
      console.error('Failed to fetch budgets', action.error);
      return state;
    case 'BUDGET_SAVE_SUCCEEDED': {
      const saved = action.budget;
      if (state.find(budget => budget.id === saved.id)) {
        return state.map(budget => budget.id === saved.id ? saved : budget);
      } else {
        return state.concat([saved]);
      }
    }
    case 'BUDGET_SAVE_FAILED':
      console.error('Failed to save budget');
      return state;
    case 'DELETE_BUDGET':
      if (action.error) {
        console.error('Failed to save budget');
        return state;
      } else {
        const deleted = action.payload;
        return state.filter((budget) => budget.id !== deleted.id);
      }
    default:
      return state;
  }
}

// TODO: loading and error?
// TODO: Use handleAction to destruct payload.
export function budgetItems(state: BudgetItem[] = [], action: Action): BudgetItem[] {
  switch (action.type) {
    case 'BUDGET_ITEMS_FETCH_SUCCEEDED':
      return action.budgetItems;
    case 'BUDGET_ITEMS_FETCH_FAILED':
      console.error('Failed to fetch items', action.error);
      return state;
    case 'BUDGET_ITEM_SAVE_SUCCEEDED': {
      const saved = action.budgetItem;
      if (state.filter(item => item.id === saved.id).length > 0) {
        return state.map(item => item.id === saved.id ? saved : item);
      } else {
        return state.concat([action.budgetItem]);
      }
    }
    case 'BUDGET_ITEM_SAVE_FAILED':
      console.error('Failed to save item', action.error);
      return state;
    case 'DELETE_ITEM':
      if (action.error) {
        console.error('Failed to delete item');
        return state;
      } else {
        const deleted = action.payload;
        return state.filter(item => item.id !== deleted.id);
      }
    default:
      return state;
  }
}

const reducers = combineReducers({
  user,
  budgets,
  selectedBudgetId,
  budgetItems,
  menuOpen,
  budgetForm,
  budgetItemForm
});

export default reducers;
