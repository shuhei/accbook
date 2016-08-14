/* @flow */
/* eslint no-console: "off" */
/* global Generator */
import { takeEvery } from 'redux-saga';
import { call, put, fork } from 'redux-saga/effects';

import * as webapi from '../webapi';
import { hideModal } from './modal';
import { fetch as fetchBudgetItems } from './budgetItems';

import type { Budget } from '../types';

// Constants

const FETCH_REQUESTED = 'budgets/FETCH/REQUESTED';
const FETCH_SUCCEEDED = 'budgets/FETCH/SUCCEEDED';
const FETCH_FAILED = 'budgets/FETCH/FAILED';

const SAVE_REQUESTED = 'budgets/SAVE/REQUESTED';
const SAVE_SUCCEEDED = 'budgets/SAVE/SUCCEEDED';
const SAVE_FAILED = 'budgets/SAVE/FAILED';

const DELETE_REQUESTED = 'budgets/DELETE/REQUESTED';
const DELETE_SUCCEEDED = 'budgets/DELETE/SUCCEEDED';
const DELETE_FAILED = 'budgets/DELETE/FAILED';

// Type

export type Action
  = { type: typeof FETCH_REQUESTED }
  | { type: typeof FETCH_SUCCEEDED, budgets: Budget[] }
  | { type: typeof FETCH_FAILED, error: Error }
  | { type: typeof SAVE_REQUESTED, budget: Budget }
  | { type: typeof SAVE_SUCCEEDED, budget: Budget }
  | { type: typeof SAVE_FAILED, error: Error }
  | { type: typeof DELETE_REQUESTED, budget: Budget }
  | { type: typeof DELETE_SUCCEEDED, budget: Budget }
  | { type: typeof DELETE_FAILED, error: Error }
  ;

// Action creators

export const fetchBudgets = (): Action =>
  ({ type: FETCH_REQUESTED });
export const fetchBudgetsSucceeded = (budgets: Budget[]): Action =>
  ({ type: FETCH_SUCCEEDED, budgets });
export const fetchBudgetsFailed = (error: Error): Action =>
  ({ type: FETCH_FAILED, error });

export const saveBudget = (budget: Budget) =>
  ({ type: SAVE_REQUESTED, budget });
export const saveBudgetSucceeded = (budget: Budget) =>
  ({ type: SAVE_SUCCEEDED, budget });
export const saveBudgetFailed = (error: Error) =>
  ({ type: SAVE_FAILED, error });

export const deleteBudget = (budget: Budget) =>
  ({ type: DELETE_REQUESTED, budget });
export const deleteBudgetSucceeded = (budget: Budget) =>
  ({ type: DELETE_SUCCEEDED, budget });
export const deleteBudgetFailed = (error: Error) =>
  ({ type: DELETE_FAILED, error });

// Reducer

// TODO: loading and error?
export default function (state: Budget[] = [], action: Action): Budget[] {
  switch (action.type) {
    case FETCH_SUCCEEDED:
      return action.budgets;
    case FETCH_FAILED:
      console.error('Failed to fetch budgets', action.error);
      return state;
    case SAVE_SUCCEEDED: {
      const saved = action.budget;
      if (state.find(budget => budget.id === saved.id)) {
        return state.map(budget => (budget.id === saved.id ? saved : budget));
      }
      return state.concat([saved]);
    }
    case SAVE_FAILED:
      console.error('Failed to save budget');
      return state;
    case DELETE_SUCCEEDED: {
      const deleted = action.budget;
      return state.filter((budget) => budget.id !== deleted.id);
    }
    case DELETE_FAILED:
      console.error('Failed to save budget');
      return state;
    default:
      return state;
  }
}

// Sagas

export function* fetch(): Generator {
  yield fork(fetchBudgetItems);
  try {
    const budgets: any = yield call(webapi.fetchBudgets);
    yield put({ type: FETCH_SUCCEEDED, budgets });
    if (budgets.length > 0) {
      yield put({ type: 'BUDGET_SELECTED', budget: budgets[0] });
    }
  } catch (error) {
    yield put({ type: FETCH_FAILED, error });
  }
}

export function* save(action: Action): Generator {
  if (action.type !== SAVE_REQUESTED) {
    return;
  }
  try {
    const budget: any = yield call(webapi.saveBudget, action.budget);
    yield put({ type: SAVE_SUCCEEDED, budget });
    yield put(hideModal());
  } catch (error) {
    yield put({ type: SAVE_FAILED, error });
  }
}

// TODO: Handle budget items of the budget.
export function* del(action: Action): Generator {
  if (action.type !== DELETE_REQUESTED) {
    return;
  }
  try {
    const deletedItem = yield call(webapi.deleteBudget, action.budget);
    yield put({ type: DELETE_SUCCEEDED, budgetItem: deletedItem });
    yield put(hideModal());
  } catch (error) {
    yield put({ type: DELETE_FAILED, error });
  }
}

function* watchFetch(): Generator {
  yield* takeEvery(FETCH_REQUESTED, fetch);
}

function* watchSave(): Generator {
  yield* takeEvery(SAVE_REQUESTED, save);
}

function* watchDelete(): Generator {
  yield* takeEvery(DELETE_REQUESTED, del);
}

export function* saga(): Generator {
  yield [
    fork(watchFetch),
    fork(watchSave),
    fork(watchDelete),
  ];
}
