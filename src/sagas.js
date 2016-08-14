/* @flow */
/* global Generator */
import { fork } from 'redux-saga/effects';

import { saga as budgets } from './modules/budgets';
import { saga as budgetItems } from './modules/budgetItems';

export default function* root(): Generator {
  yield [
    fork(budgets),
    fork(budgetItems),
  ];
}
