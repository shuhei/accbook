/* @flow */
export type BudgetForm = {
  budget: ?Object,
  errors: Object
};

export type Budget = {
  id: number,
  label: string
};

export type BudgetItem = {
  id: number,
  amount: number,
  label: string,
  date: Date
};

export type BudgetItemForm = {
  item: ?Object,
  errors: Object
};

export type User = {
};

export type Action
  = { type: 'SIGNUP' }
  | { type: 'LOGIN', error: boolean, payload: User }
  | { type: 'LOGOUT' }
  | { type: 'CURRENT_USER', error: boolean, payload: User }

  | { type: 'FETCH_BUDGETS', error: boolean, payload: Budget[] }
  | { type: 'SAVE_BUDGET', error: boolean, payload: Budget }
  | { type: 'DELETE_BUDGET', error: boolean, payload: Budget }
  | { type: 'SELECT_BUDGET', payload: Budget }
  | { type: 'NEW_BUDGET' }
  | { type: 'EDIT_BUDGET', payload: Budget }

  | { type: 'NEW_ITEM' }
  | { type: 'EDIT_ITEM', payload: BudgetItem }
  | { type: 'SAVE_ITEM', error: boolean, payload: BudgetItem }
  | { type: 'DELETE_ITEM', error: boolean, payload: BudgetItem }
  | { type: 'FETCH_ITEMS', error: boolean, payload: BudgetItem[] }

  | { type: 'CLOSE_BUDGET_FORM' }
  | { type: 'CLOSE_ITEM_FORM' }

  | { type: 'TOGGLE_MENU' }
  ;
