/* @flow */
import { takeEvery } from 'redux-saga';
import { call, put, fork, select } from 'redux-saga/effects';
import * as webapi from './webapi';

import type {
  Action,
  Budget
} from './types';

// -- Subroutines

export function *fetchBudgets(): Generator {
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

export function *fetchBudgetItems(): Generator {
  try {
    const budgetItems: any = yield call(webapi.fetchItems);
    yield put({ type: 'BUDGET_ITEMS_FETCH_SUCCEEDED', budgetItems });
  } catch (error) {
    yield put({ type: 'BUDGET_ITEMS_FETCH_FAILED', error });
  }
}

export function *saveBudget(action: Action): Generator {
  if (action.type !== 'BUDGET_SAVE_REQUESTED') {
    return;
  }
  try {
    const budget: any = yield call(webapi.saveBudget, action.budget);
    yield put({ type: 'BUDGET_SAVE_SUCCEEDED', budget });
  } catch (error) {
    yield put({ type: 'BUDGET_SAVE_FAILED', error });
  }
}

export function *saveBudgetItem(action: Action): Generator {
  if (action.type !== 'BUDGET_ITEM_SAVE_REQUESTED') {
    return;
  }
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

function *watchBudgetsFetch(): Generator {
  yield* takeEvery('BUDGETS_FETCH_REQUESTED', fetchBudgets);
}

function *watchBudgetSave(): Generator {
  yield* takeEvery('BUDGET_SAVE_REQUESTED', saveBudget);
}

function *watchBudgetItemSave(): Generator {
  yield* takeEvery('BUDGET_ITEM_SAVE_REQUESTED', saveBudgetItem);
}

export default function *root(): Generator {
  yield [
    fork(watchBudgetsFetch),
    fork(watchBudgetSave),
    fork(watchBudgetItemSave)
  ];
}
