/* @flow */
export type BudgetForm = {
  budget: ?Object,
  errors: Object
};

export type Budget = {
  id: string,
  label: string
};

export type BudgetItem = {
  id: string,
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

export type Auth = {
  username: string,
  password: string
};

export type Action
  = { type: 'SIGNUP' }
  | { type: 'LOGIN', error: boolean, payload: User }
  | { type: 'LOGOUT' }
  | { type: 'CURRENT_USER', error: boolean, payload: User }

  | { type: 'BUDGETS_FETCH_REQUESTED' }
  | { type: 'BUDGETS_FETCH_SUCCEEDED', budgets: Budget[] }
  | { type: 'BUDGETS_FETCH_FAILED', error: Error }
  | { type: 'BUDGET_SELECTED', budget: Budget }
  | { type: 'BUDGET_SAVE_REQUESTED', budget: Budget }
  | { type: 'BUDGET_SAVE_SUCCEEDED', budget: Budget }
  | { type: 'BUDGET_SAVE_FAILED', error: Error }
  | { type: 'BUDGET_DELETE_REQUESTED', budget: Budget }
  | { type: 'BUDGET_DELETE_SUCCEEDED', budget: Budget }
  | { type: 'BUDGET_DELETE_FAILED', error: Error }
  | { type: 'NEW_BUDGET' }
  | { type: 'EDIT_BUDGET', payload: Budget }

  | { type: 'BUDGET_ITEMS_FETCH_SUCCEEDED', budgetItems: BudgetItem[] }
  | { type: 'BUDGET_ITEMS_FETCH_FAILED', error: Error }
  | { type: 'BUDGET_ITEM_SAVE_REQUESTED', budgetItem: BudgetItem }
  | { type: 'BUDGET_ITEM_SAVE_SUCCEEDED', budgetItem: BudgetItem }
  | { type: 'BUDGET_ITEM_SAVE_FAILED', error: Error }
  | { type: 'BUDGET_ITEM_DELETE_REQUESTED', budgetItem: BudgetItem }
  | { type: 'BUDGET_ITEM_DELETE_SUCCEEDED', budgetItem: BudgetItem }
  | { type: 'BUDGET_ITEM_DELETE_FAILED', error: Error }
  | { type: 'NEW_ITEM' }
  | { type: 'EDIT_ITEM', payload: BudgetItem }

  | { type: 'CLOSE_BUDGET_FORM' }
  | { type: 'CLOSE_ITEM_FORM' }

  | { type: 'TOGGLE_MENU' }
  ;
