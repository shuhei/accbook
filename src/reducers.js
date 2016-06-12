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
    case 'EDIT_BUDGET':
      return { budget: action.payload, errors: {} };
    case 'SAVE_BUDGET':
      if (action.error) {
        // TODO: Add error.
        return state;
      } else {
        return { budget: null, errors: {} };
      }
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
    case 'SAVE_ITEM':
      if (action.error) {
        // TODO: Add error.
        return state;
      } else {
        return { item: null, errors: {} };
      }
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
    case 'SELECT_BUDGET':
      return action.payload.id;
    default:
      return state;
  }
}

// TODO: loading and error?
export function budgets(state: Budget[] = [], action: Action): Budget[] {
  switch (action.type) {
    case 'FETCH_BUDGETS':
      if (action.error) {
        console.error('Failed to fetch budgets');
        return state;
      } else {
        return action.payload;
      }
    case 'SAVE_BUDGET':
      if (action.error) {
        console.error('Failed to save budget');
        return state;
      } else {
        const saved = action.payload;
        if (state.find(budget => budget.id === saved.id)) {
          return state.map(budget => budget.id === saved.id ? saved : budget);
        } else {
          return state.concat([action.payload]);
        }
      }
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
    case 'FETCH_ITEMS': {
      if (action.error) {
        // TODO: Set error.
        console.error('Failed to fetch items');
        return state;
      } else {
        return action.payload;
      }
    }
    case 'SAVE_ITEM': {
      if (action.error) {
        // TODO: Set error.
        console.error('Failed to save item');
        return state;
      } else {
        const saved = action.payload;
        if (state.filter(item => item.id === saved.id).length > 0) {
          return state.map(item => item.id === saved.id ? saved : item);
        } else {
          return state.concat([action.payload]);
        }
      }
    }
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
