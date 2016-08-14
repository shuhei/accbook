/* @flow */
import 'babel-polyfill';
import { call, put, fork } from 'redux-saga/effects';
import { deepEqual } from 'assert';

import reducer, {
  fetch as fetchSaga,
  save as saveSaga,
  fetchBudgetsSucceeded,
  saveBudget,
  saveBudgetSucceeded,
  saveBudgetFailed,
  deleteBudgetSucceeded,
} from '../../src/modules/budgets';
import { fetch as fetchItemsSaga } from '../../src/modules/budgetItems';
import { hideModal } from '../../src/modules/modal';
import * as webapi from '../../src/webapi';

import type { Budget } from '../../src/types';

function makeBudget(id: string): Budget {
  return {
    id,
    label: 'dummy budget',
  };
}

describe('budgets', () => {
  describe('reducer', () => {
    describe('fetch succeeded', () => {
      it('replaces budgets', () => {
        const state = [makeBudget('123')];
        const action = fetchBudgetsSucceeded([makeBudget('234'), makeBudget('345')]);

        deepEqual(reducer(state, action), [makeBudget('234'), makeBudget('345')]);
      });
    });

    describe('save succeeded', () => {
      it('adds a budget', () => {
        const state = [makeBudget('123')];
        const action = saveBudgetSucceeded(makeBudget('234'));

        deepEqual(reducer(state, action), [makeBudget('123'), makeBudget('234')]);
      });
    });

    describe('delete succeeded', () => {
      it('deletes a budget', () => {
        const state = [makeBudget('123'), makeBudget('234')];
        const action = deleteBudgetSucceeded(makeBudget('234'));

        deepEqual(reducer(state, action), [makeBudget('123')]);
      });
    });
  });

  describe('saga', () => {
    describe('fetchBudgets', () => {
      it('fetches budgets and select first one', () => {
        const generator = fetchSaga();

        const budgets = [
          { id: '1', label: 'first' },
          { id: '2', label: 'second' },
        ];
        deepEqual(generator.next().value, fork(fetchItemsSaga));
        deepEqual(generator.next().value, call(webapi.fetchBudgets));
        deepEqual(generator.next(budgets).value, put(fetchBudgetsSucceeded(budgets)));
        deepEqual(generator.next().value, put({ type: 'BUDGET_SELECTED', budget: budgets[0] }));
        deepEqual(generator.next(), { done: true, value: undefined });
      });
    });

    describe('saveBudget', () => {
      it('saves budget and puts saved budget', () => {
        const budget = { id: '', label: 'test' };
        const action = saveBudget(budget);
        const generator = saveSaga(action);

        const result = { id: 'abc', label: 'test' };
        deepEqual(generator.next().value, call(webapi.saveBudget, budget));
        deepEqual(generator.next(result).value, put(saveBudgetSucceeded(result)));
        deepEqual(generator.next().value, put(hideModal()));
        deepEqual(generator.next(), { done: true, value: undefined });
      });

      it('puts failed action if it fails', () => {
        const budget = { id: '', label: 'test' };
        const action = saveBudget(budget);
        const generator = saveSaga(action);

        const error = new Error('Failed to save budget');
        deepEqual(generator.next().value, call(webapi.saveBudget, budget));
        deepEqual(generator.throw(error).value, put(saveBudgetFailed(error)));
        deepEqual(generator.next(), { done: true, value: undefined });
      });
    });
  });
});
