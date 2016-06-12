/* @flow */
import { takeEvery } from 'redux-saga';
import { call, put, fork, select } from 'redux-saga/effects';
import * as webapi from './webapi';

import type {
  Action,
  Budget
} from './types';

// -- Subroutines

function *fetchBudgets(action) {
  yield fork(fetchBudgetItems);
  try {
    const budgets: any = yield call(webapi.fetchBudgets);
    yield put({ type: 'BUDGETS_FETCH_SUCCEEDED', budgets });
    if (budgets.length > 0) {
      yield put({ type: 'BUDGET_SELECTED', budget: budgets[0] });
    }
  } catch (error) {
    yield put({ type: 'BUDGETS_FETCH_FAILED', error });
  }
}

function *fetchBudgetItems(action) {
  try {
    const budgetItems: any = yield call(webapi.fetchItems);
    yield put({ type: 'BUDGET_ITEMS_FETCH_SUCCEEDED', budgetItems });
  } catch (error) {
    yield put({ type: 'BUDGET_ITEMS_FETCH_REQUESTED', error });
  }
}

function *saveBudget(action) {
  try {
    const budget: any = yield call(webapi.saveBudget, action.budget);
    yield put({ type: 'BUDGET_SAVE_SUCCEEDED', budget });
  } catch (error) {
    yield put({ type: 'BUDGET_SAVE_FAILED', error });
  }
}

function *saveBudgetItem(action) {
  try {
    const state: any = yield select();
    const item = action.budgetItem;
    const itemWithBudgetId = item.id ? item : { ...item, budgetId: state.selectedBudgetId };
    const budgetItem: any = yield call(webapi.saveItem, itemWithBudgetId);
    yield put({ type: 'BUDGET_ITEM_SAVE_SUCCEEDED', budgetItem });
  } catch (error) {
    yield put({ type: 'BUDGET_ITEM_SAVE_FAILED', error });
  }
}

// -- Watchers

function *watchBudgetsFetch(): any {
  yield* takeEvery('BUDGETS_FETCH_REQUESTED', fetchBudgets);
}

function *watchBudgetSave(): any {
  yield* takeEvery('BUDGET_SAVE_REQUESTED', saveBudget);
}

function *watchBudgetItemSave(): any {
  yield* takeEvery('BUDGET_ITEM_SAVE_REQUESTED', saveBudgetItem);
}

export default function *root(): any {
  yield [
    fork(watchBudgetsFetch),
    fork(watchBudgetSave),
    fork(watchBudgetItemSave)
  ];
}
