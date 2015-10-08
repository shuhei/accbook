import { equal, deepEqual } from 'assert';

import {
  TOGGLE_MENU,
  FETCH_ITEMS, SAVE_ITEM, DELETE_ITEM
} from '../src/actions';
import { user, menuOpen, budgetItems } from '../src/reducers';

describe('user', () => {
  describe('edge cases', () => {
    it('defaults to null', () => {
      equal(user(undefined, {}), null);
    });

    it('passes through if unknown type', () => {
      const state = { id: 123 };

      equal(user(state, {}), state);
    });
  });
});

describe('menuOpen', () => {
  describe('edge cases', () => {
    it('defaults to false', () => {
      equal(menuOpen(undefined, {}), false);
    });

    it('passes through if unknown type', () => {
      equal(menuOpen(true, {}), true);
      equal(menuOpen(false, {}), false);
    });
  });

  describe('TOGGLE_MENU', () => {
    it('toggles the flag', () => {
      equal(menuOpen(false, { type: TOGGLE_MENU }), true);
      equal(menuOpen(true, { type: TOGGLE_MENU }), false);
    });
  });
});

describe('budgetItems', () => {
  describe('edge cases', () => {
    it('defaults to an empty array', () => {
      deepEqual(budgetItems(undefined, {}), []);
    });

    it('passes through if unknown type', () => {
      const state = [{ id: 123 }, { id: 234 }];

      deepEqual(budgetItems(state, {}), state);
    });
  });

  describe('FETCH_ITEMS', () => {
    it('adds items', () => {
      const state = [{ id: 123 }];
      const action = { type: FETCH_ITEMS, payload: [{ id: 234 }, { id: 345 }] };

      deepEqual(budgetItems(state, action), [{ id: 123 }, { id: 234 }, { id: 345 }]);
    });

    it('does not change state if error', () => {
      const state = [{ id: 123 }];
      const action = { type: FETCH_ITEMS, error: true, payload: new Error('error') };

      equal(budgetItems(state, action), state);
    });
  });

  describe('SAVE_ITEM', () => {
    it('adds item', () => {
      const state = [{ id: 123 }];
      const action = { type: SAVE_ITEM, payload: { id: 234 } };

      deepEqual(budgetItems(state, action), [{ id: 123 }, { id: 234 }]);
    });

    it('replaces item', () => {
      const state = [{ id: 123, amount: 10 }, { id: 234, amount: 20 }];
      const action = { type: SAVE_ITEM, payload: { id: 234, amount: 30 } };

      deepEqual(budgetItems(state, action),
                [{ id: 123, amount: 10 }, { id: 234, amount: 30 }]);
    });

    it('does not change state if error', () => {
      const state = [{ id: 123, amount: 10 }, { id: 234, amount: 20 }];
      const action = { type: SAVE_ITEM, error: true, payload: new Error('error') };

      equal(budgetItems(state, action), state);
    });
  });

  describe('DELETE_ITEM', () => {
    it('deletes item', () => {
      const state = [{ id: 123 }, { id: 234 }];
      const action = { type: DELETE_ITEM, payload: { id: 234 } };
      deepEqual(budgetItems(state, action), [{ id: 123 }]);
    });
  });
});
