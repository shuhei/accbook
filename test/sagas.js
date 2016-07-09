/* @flow */
import { call, put } from 'redux-saga/effects';
import { equal, deepEqual } from 'assert';

import {
  fetchBudgets,
  fetchBudgetItems,
  saveBudget,
  saveBudgetItem
} from '../src/sagas';
import * as webapi from '../src/webapi';

import type {
  Budget,
  BudgetItem
} from '../src/types';

describe('fetchBudgetItems', () => {
  it('fetches items and puts them', () => {
    const generator = fetchBudgetItems();

    const budgetItems = [];
    deepEqual(generator.next().value, call(webapi.fetchItems));
    deepEqual(generator.next(budgetItems).value, put({ type: 'BUDGET_ITEMS_FETCH_SUCCEEDED', budgetItems }));
    deepEqual(generator.next(), { done: true, value: undefined });
  });

  it('puts failed action if it fails', () => {
    const generator = fetchBudgetItems();

    const error = new Error('Failed to fetch items');
    deepEqual(generator.next().value, call(webapi.fetchItems));
    deepEqual(generator.throw(error).value, put({ type: 'BUDGET_ITEMS_FETCH_FAILED', error }));
    deepEqual(generator.next(), { done: true, value: undefined });
  });
});

describe('saveBudget', () => {
  it('saves budget and puts saved budget', () => {
    const budget = { id: '', label: 'test' };
    const action = { type: 'BUDGET_SAVE_REQUESTED', budget };
    const generator = saveBudget(action);

    const result = { id: 'abc', label: 'test' };
    deepEqual(generator.next().value, call(webapi.saveBudget, budget));
    deepEqual(generator.next(result).value, put({ type: 'BUDGET_SAVE_SUCCEEDED', budget: result }));
    deepEqual(generator.next(), { done: true, value: undefined });
  });

  it('puts failed action if it fails', () => {
    const budget = { id: '', label: 'test' };
    const action = { type: 'BUDGET_SAVE_REQUESTED', budget };
    const generator = saveBudget(action);

    const error = new Error('Failed to save budget');
    deepEqual(generator.next().value, call(webapi.saveBudget, budget));
    deepEqual(generator.throw(error).value, put({ type: 'BUDGET_SAVE_FAILED', error }));
    deepEqual(generator.next(), { done: true, value: undefined });
  });
});
