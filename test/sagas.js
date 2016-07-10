/* @flow */
import { call, put, select, fork } from 'redux-saga/effects';
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

describe('fetchBudgets', () => {
  it('fetches budgets and select first one', () => {
    const generator = fetchBudgets();

    const budgets = [
      { id: '1', label: 'first' },
      { id: '2', label: 'second' }
    ];
    deepEqual(generator.next().value, fork(fetchBudgetItems));
    deepEqual(generator.next().value, call(webapi.fetchBudgets));
    deepEqual(generator.next(budgets).value, put({ type: 'BUDGETS_FETCH_SUCCEEDED', budgets }));
    deepEqual(generator.next().value, put({ type: 'BUDGET_SELECTED', budget: budgets[0] }));
    deepEqual(generator.next(), { done: true, value: undefined });
  });
});

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

describe('saveBudgetItem', () => {
  it('sets selected budget ID to new item', () => {
    const budgetItem = {
      id: '',
      label: 'hello',
      amount: 1230,
      date: new Date(2016, 3, 4),
      budgetId: null
    };
    const action = {
      type: 'BUDGET_ITEM_SAVE_REQUESTED',
      budgetItem
    };
    const generator = saveBudgetItem(action);

    deepEqual(generator.next().value, select());
    const state = { selectedBudgetId: 'abc' };
    const expectedItem = { ...budgetItem, budgetId: 'abc' };
    deepEqual(generator.next(state).value, call(webapi.saveItem, expectedItem));
    const savedItem = { ...expectedItem, id: 'bcd' };
    deepEqual(generator.next(savedItem).value, put({ type: 'BUDGET_ITEM_SAVE_SUCCEEDED', budgetItem: savedItem }));
    deepEqual(generator.next(), { done: true, value: undefined });
  });

  it('does not update selected budget ID to existing item', () => {
    const budgetItem = {
      id: 'foo',
      label: 'hello',
      amount: 1230,
      date: new Date(2016, 3, 4),
      budgetId: 'existing'
    };
    const action = {
      type: 'BUDGET_ITEM_SAVE_REQUESTED',
      budgetItem
    };
    const generator = saveBudgetItem(action);

    deepEqual(generator.next().value, select());
    const state = { selectedBudgetId: 'abc' };
    deepEqual(generator.next(state).value, call(webapi.saveItem, budgetItem));
    deepEqual(generator.next(budgetItem).value, put({ type: 'BUDGET_ITEM_SAVE_SUCCEEDED', budgetItem }));
    deepEqual(generator.next(), { done: true, value: undefined });
  });
});
