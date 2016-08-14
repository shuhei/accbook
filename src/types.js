/* @flow */
export type Budget = {
  id: string,
  label: string
};

export type BudgetItem = {
  id: string,
  amount: number,
  label: string,
  date: Date,
  budgetId: ?string
};

export type User = {
};

export type Auth = {
  username: string,
  password: string
};

export type Action = {
  type: string,
  payload?: any,
  error?: boolean,
  meta?: any
};
