/* @flow */
import 'babel-polyfill';
import { deepEqual } from 'assert';
import { call, put, select } from 'redux-saga/effects';

import reducer, {
  fetch as fetchSaga,
  save as saveSaga,
  fetchBudgetItemsSucceeded,
  fetchBudgetItemsFailed,
  saveBudgetItem,
  saveBudgetItemSucceeded,
  deleteBudgetItemSucceeded,
} from '../../src/modules/budgetItems';
import * as webapi from '../../src/webapi';
import { hideModal } from '../../src/modules/modal';

import type { BudgetItem } from '../../src/types';

const makeBudgetItem = (id: string): BudgetItem => ({
  id,
  label: 'dummy item',
  amount: 12300,
  date: new Date(2015, 3, 4),
  budgetId: null,
});

describe('budgetItems', () => {
  describe('reducer', () => {
    describe('fetch succeeded', () => {
      it('replaces items', () => {
        const state = [makeBudgetItem('123')];
        const action = fetchBudgetItemsSucceeded([
          makeBudgetItem('234'),
          makeBudgetItem('345'),
        ]);

        deepEqual(reducer(state, action), [
          makeBudgetItem('234'),
          makeBudgetItem('345'),
        ]);
      });
    });

    describe('save succeeded', () => {
      it('adds item', () => {
        const state = [makeBudgetItem('123')];
        const action = saveBudgetItemSucceeded(makeBudgetItem('234'));

        deepEqual(reducer(state, action), [
          makeBudgetItem('123'),
          makeBudgetItem('234'),
        ]);
      });

      it('replaces item', () => {
        const state = [makeBudgetItem('123'), makeBudgetItem('234')];
        const action = saveBudgetItemSucceeded({
          id: '234',
          amount: 99999,
          label: 'foo',
          date: new Date(2000, 5, 5),
          budgetId: '567',
        });

        deepEqual(reducer(state, action), [
          makeBudgetItem('123'),
          { id: '234', amount: 99999, label: 'foo', date: new Date(2000, 5, 5), budgetId: '567' },
        ]);
      });
    });

    describe('delete succeeded', () => {
      it('deletes item', () => {
        const state = [makeBudgetItem('123'), makeBudgetItem('234')];
        const action = deleteBudgetItemSucceeded(makeBudgetItem('123'));

        deepEqual(reducer(state, action), [makeBudgetItem('234')]);
      });
    });
  });

  describe('saga', () => {
    describe('fetchBudgetItems', () => {
      it('fetches items and puts them', () => {
        const generator = fetchSaga();

        const budgetItems = [];
        deepEqual(generator.next().value, call(webapi.fetchItems));
        deepEqual(
          generator.next(budgetItems).value,
          put(fetchBudgetItemsSucceeded(budgetItems))
        );
        deepEqual(generator.next(), { done: true, value: undefined });
      });

      it('puts failed action if it fails', () => {
        const generator = fetchSaga();

        const error = new Error('Failed to fetch items');
        deepEqual(generator.next().value, call(webapi.fetchItems));
        deepEqual(
          generator.throw(error).value,
          put(fetchBudgetItemsFailed(error))
        );
        deepEqual(generator.next(), { done: true, value: undefined });
      });
    });

    describe('saveBudgetItem', () => {
      it('sets selected budget ID to new item', () => {
        const budgetItem = {
          id: '',
          label: 'hello',
          amount: 1230,
          date: new Date(2016, 3, 4),
          budgetId: null,
        };
        const generator = saveSaga(saveBudgetItem(budgetItem));

        deepEqual(generator.next().value, select());
        const state = { selectedBudgetId: 'abc' };
        const expectedItem = { ...budgetItem, budgetId: 'abc' };
        deepEqual(generator.next(state).value, call(webapi.saveItem, expectedItem));
        const savedItem = { ...expectedItem, id: 'bcd' };
        deepEqual(
          generator.next(savedItem).value,
          put(saveBudgetItemSucceeded(savedItem))
        );
        deepEqual(generator.next().value, put(hideModal()));
        deepEqual(generator.next(), { done: true, value: undefined });
      });

      it('does not update selected budget ID to existing item', () => {
        const budgetItem = {
          id: 'foo',
          label: 'hello',
          amount: 1230,
          date: new Date(2016, 3, 4),
          budgetId: 'existing',
        };
        const generator = saveSaga(saveBudgetItem(budgetItem));

        deepEqual(generator.next().value, select());
        const state = { selectedBudgetId: 'abc' };
        deepEqual(generator.next(state).value, call(webapi.saveItem, budgetItem));
        deepEqual(
          generator.next(budgetItem).value,
          put(saveBudgetItemSucceeded(budgetItem))
        );
        deepEqual(generator.next().value, put(hideModal()));
        deepEqual(generator.next(), { done: true, value: undefined });
      });
    });
  });
});
