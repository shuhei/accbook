/* @flow */
import 'babel-polyfill';
import { equal, deepEqual } from 'assert';

import {
  user,
  menuOpen,
  selectedBudgetId,
} from '../src/reducers';

describe('reducers', () => {
  describe('user', () => {
    describe('LOGIN', () => {
      it('sets user', () => {
        const action = { type: 'LOGIN', payload: { id: 123 }, error: false };
        deepEqual(user(null, action), { id: 123 });
        deepEqual(user({ id: 234 }, action), { id: 123 });
      });
    });

    describe('LOGOUT', () => {
      it('unsets user', () => {
        const action = { type: 'LOGOUT' };
        equal(user(null, action), null);
        equal(user({ id: 123 }, action), null);
      });
    });

    describe('CURRENT_USER', () => {
      it('sets user', () => {
        const action = { type: 'CURRENT_USER', payload: { id: 123 }, error: false };
        deepEqual(user(null, action), { id: 123 });
        deepEqual(user({ id: 234 }, action), { id: 123 });
      });
    });
  });

  describe('menuOpen', () => {
    describe('TOGGLE_MENU', () => {
      it('toggles the flag', () => {
        equal(menuOpen(false, { type: 'TOGGLE_MENU' }), true);
        equal(menuOpen(true, { type: 'TOGGLE_MENU' }), false);
      });
    });
  });

  describe('selectedBudgetId', () => {
    describe('BUDGET_SELECTED', () => {
      it('replaces with id property', () => {
        const action = {
          type: 'BUDGET_SELECTED',
          budget: { id: 'bar', label: 'label' },
        };

        equal(selectedBudgetId('foo', action), 'bar');
      });
    });
  });
});
