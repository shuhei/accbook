/* @flow */
/* global Generator */
/* eslint no-console: "off" */
import { takeEvery } from 'redux-saga';
import { call, put, select, fork } from 'redux-saga/effects';
import * as webapi from '../webapi';
import { hideModal } from './modal';

import type { BudgetItem } from '../types';

// Constants

const FETCH_SUCCEEDED = 'budgetItems/FETCH/SUCCEEDED';
const FETCH_FAILED = 'budgetItems/FETCH/FAILED';

const SAVE_REQUESTED = 'budgetItems/SAVE/REQUESTED';
const SAVE_SUCCEEDED = 'budgetItems/SAVE/SUCCEEDED';
const SAVE_FAILED = 'budgetItems/SAVE/FAILED';

const DELETE_REQUESTED = 'budgetItems/DELETE/REQUESTED';
const DELETE_SUCCEEDED = 'budgetItems/DELETE/SUCCEEDED';
const DELETE_FAILED = 'budgetItems/DELETE/FAILED';

// Type
type Action
  = { type: typeof FETCH_SUCCEEDED, budgetItems: BudgetItem[] }
  | { type: typeof FETCH_FAILED, error: Error }
  | { type: typeof SAVE_REQUESTED, budgetItem: BudgetItem }
  | { type: typeof SAVE_SUCCEEDED, budgetItem: BudgetItem }
  | { type: typeof SAVE_FAILED, error: Error }
  | { type: typeof DELETE_REQUESTED, budgetItem: BudgetItem }
  | { type: typeof DELETE_SUCCEEDED, budgetItem: BudgetItem }
  | { type: typeof DELETE_FAILED, error: Error }
  ;

// Action creators

export const fetchBudgetItemsSucceeded = (budgetItems: BudgetItem[]): Action =>
  ({ type: FETCH_SUCCEEDED, budgetItems });
export const fetchBudgetItemsFailed = (error: Error): Action =>
  ({ type: FETCH_FAILED, error });

export const saveBudgetItem = (budgetItem: BudgetItem): Action =>
  ({ type: SAVE_REQUESTED, budgetItem });
export const saveBudgetItemSucceeded = (budgetItem: BudgetItem): Action =>
  ({ type: SAVE_SUCCEEDED, budgetItem });
export const saveBudgetItemFailed = (error: Error): Action =>
  ({ type: SAVE_FAILED, error });

export const deleteBudgetItem = (budgetItem: BudgetItem): Action =>
  ({ type: DELETE_REQUESTED, budgetItem });
export const deleteBudgetItemSucceeded = (budgetItem: BudgetItem): Action =>
  ({ type: DELETE_SUCCEEDED, budgetItem });
export const deletedBudgetItemFailed = (error: Error): Action =>
  ({ type: DELETE_FAILED, error });

// Reducer

// TODO: loading and error?
// TODO: Use handleAction to destruct payload.
export default function (state: BudgetItem[] = [], action: Action): BudgetItem[] {
  switch (action.type) {
    case FETCH_SUCCEEDED:
      return action.budgetItems;
    case FETCH_FAILED:
      console.error('Failed to fetch items', action.error);
      return state;
    case SAVE_SUCCEEDED: {
      const saved = action.budgetItem;
      if (state.filter(item => item.id === saved.id).length > 0) {
        return state.map(item => (item.id === saved.id ? saved : item));
      }
      return state.concat([action.budgetItem]);
    }
    case SAVE_FAILED:
      console.error('Failed to save item', action.error);
      return state;
    case DELETE_SUCCEEDED: {
      const deleted = action.budgetItem;
      return state.filter(item => item.id !== deleted.id);
    }
    case DELETE_FAILED:
      console.error('Failed to delete item');
      return state;
    default:
      return state;
  }
}

// Sagas

export function* fetch(): Generator {
  try {
    const budgetItems: any = yield call(webapi.fetchItems);
    yield put({ type: FETCH_SUCCEEDED, budgetItems });
  } catch (error) {
    yield put({ type: FETCH_FAILED, error });
  }
}

export function* save(action: Action): Generator {
  if (action.type !== SAVE_REQUESTED) {
    return;
  }
  try {
    const state: any = yield select();
    const item = action.budgetItem;
    const itemWithBudgetId = item.id ? item : { ...item, budgetId: state.selectedBudgetId };
    const budgetItem: any = yield call(webapi.saveItem, itemWithBudgetId);
    yield put({ type: SAVE_SUCCEEDED, budgetItem });
    yield put(hideModal());
  } catch (error) {
    yield put({ type: SAVE_FAILED, error });
  }
}

export function* del(action: Action): Generator {
  if (action.type !== DELETE_REQUESTED) {
    return;
  }
  try {
    const deletedItem = yield call(webapi.deleteItem, action.budgetItem);
    yield put({ type: DELETE_SUCCEEDED, budgetItem: deletedItem });
    yield put(hideModal());
  } catch (error) {
    yield put({ type: DELETE_FAILED, error });
  }
}

function* watchSave(): Generator {
  yield* takeEvery(SAVE_REQUESTED, save);
}

function* watchDelete(): Generator {
  yield* takeEvery(DELETE_REQUESTED, del);
}

export function* saga(): Generator {
  yield [
    fork(watchSave),
    fork(watchDelete),
  ];
}
