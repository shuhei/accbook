import { equal, deepEqual } from 'assert';

import {
  TOGGLE_MENU,
  SELECT_BUDGET, FETCH_BUDGETS, SAVE_BUDGET, DELETE_BUDGET,
  FETCH_ITEMS, SAVE_ITEM, DELETE_ITEM,
  CLOSE_ITEM_FORM
} from '../src/actions';
import {
  user,
  menuOpen,
  budgetItemForm,
  selectedBudgetId,
  budgets,
  budgetItems
} from '../src/reducers';

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

describe('budgetItemForm', () => {
  describe('edge cases', () => {
    it('defaults to no item or no errors', () => {
      const { item, errors } = budgetItemForm(undefined, {});

      equal(item, null);
      deepEqual(errors, {});
    });

    it('passes through if unknown type', () => {
      const state = { item: null, errors: {} };

      equal(budgetItemForm(state, {}), state);
    });
  });

  describe('DELETE_ITEM', () => {
    it('closes form if no error', () => {
      const state = {
        budget: { id: 123 },
        errors: ['error']
      }

      const { item, errors } = budgetItemForm(state, { type: DELETE_ITEM });
      equal(item, null);
      deepEqual(errors, {});
    });

    it('passes through if error', () => {
      const state = {
        budget: { id: 123 },
        errors: ['error']
      }
      const action = {
        type: DELETE_ITEM,
        error: true,
        payload: new Error('error')
      };

      equal(budgetItemForm(state, action), state);
    });
  });

  describe('CLOSE_ITEM_FORM', () => {
    it('closes form', () => {
      const state = {
        budget: { id: 123 },
        errors: ['error']
      }

      const { item, errors } = budgetItemForm(state, { type: CLOSE_ITEM_FORM });
      equal(item, null);
      deepEqual(errors, {});
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

describe('selectedBudgetId', () => {
  describe('edge cases', () => {
    it('defaults to null', () => {
      equal(selectedBudgetId(undefined, {}), null);
    });

    it('passes through if unknown type', () => {
      equal(selectedBudgetId('hello', {}), 'hello');
    });
  });

  describe('SELECT_BUDGET', () => {
    it('replaces with id property', () => {
      const action = { type: SELECT_BUDGET, payload: { id: 'bar' } };

      equal(selectedBudgetId('foo', action), 'bar');
    });
  });
});

describe('budgets', () => {
  describe('edge cases', () => {
    it('defaults to an empty array', () => {
      deepEqual(budgets(undefined, {}), []);
    });

    it('passes through if unknown type', () => {
      const state = [{ id: 123 }, { id: 234 }];
      deepEqual(budgets(state, {}), state);
    });
  });

  describe('FETCH_BUDGETS', () => {
    it('replaces budgets', () => {
      const state = [{ id: 123 }];
      const action = { type: FETCH_BUDGETS, payload: [{ id: 234 }, { id: 345 }] };

      deepEqual(budgets(state, action), [{ id: 234 }, { id: 345 }]);
    });

    it('does not change state if error', () => {
      const state = [{ id: 123 }];
      const action = { type: FETCH_BUDGETS, error: true, payload: new Error('error') };

      equal(budgets(state, action), state);
    });
  });

  describe('SAVE_BUDGET', () => {
    it('adds a budget', () => {
      const state = [{ id: 123 }];
      const action = { type: SAVE_BUDGET, payload: { id: 234 } };

      deepEqual(budgets(state, action), [{ id: 123 }, { id: 234 }]);
    });

    it('does not change state if error', () => {
      const state = [{ id: 123 }];
      const action = { type: SAVE_BUDGET, error: true, payload: new Error('error') };

      deepEqual(budgets(state, action), [{ id: 123 }]);
    });
  });

  describe('DELETE_BUDGET', () => {
    it('deletes a budget', () => {
      const state = [{ id: 123 }, { id: 234 }];
      const action = { type: DELETE_BUDGET, payload: { id: 234 } };

      deepEqual(budgets(state, action), [{ id: 123 }]);
    });

    it('does not change state if error', () => {
      const state = [{ id: 123 }, { id: 234 }];
      const action = { type: DELETE_BUDGET, error: true, payload: new Error('error') };

      deepEqual(budgets(state, action), [{ id: 123 }, { id: 234 }]);
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
    it('replaces items', () => {
      const state = [{ id: 123 }];
      const action = { type: FETCH_ITEMS, payload: [{ id: 234 }, { id: 345 }] };

      deepEqual(budgetItems(state, action), [{ id: 234 }, { id: 345 }]);
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
