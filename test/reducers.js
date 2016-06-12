/* @flow */
import { equal, deepEqual } from 'assert';

import {
  user,
  menuOpen,
  budgetItemForm,
  selectedBudgetId,
  budgets,
  budgetItems
} from '../src/reducers';
import type {
  Budget,
  BudgetItem
} from '../src/types';

declare function describe(description: string, spec: () => void): void;
declare function it(description: string, spec: () => void): void;

function makeBudget(id: string): Budget {
  return {
    id,
    label: 'dummy budget'
  };
}
function makeBudgetItem(id: string): BudgetItem {
  return {
    id,
    label: 'dummy item',
    amount: 12300,
    date: new Date(2015, 3, 4)
  };
}

describe('user', () => {
  describe('edge cases', () => {
    it('passes through if unknown type', () => {
      const state = { id: 123 };

      equal(user(state, { type: 'SIGNUP' }), state);
    });
  });
});

describe('budgetItemForm', () => {
  describe('BUDGET_ITEM_DELETE_SUCCEEDED', () => {
    it('closes form', () => {
      const state = {
        item: { id: 123 },
        errors: {}
      };
      const action = {
        type: 'BUDGET_ITEM_DELETE_SUCCEEDED',
        budgetItem: { id: 123, label: '', amount: 0, date: new Date() }
      };

      const { item, errors } = budgetItemForm(state, action);
      equal(item, null);
    });
  });

  describe('BUDGET_ITEM_DELETE_FAILED', () => {
    it('passes through', () => {
      const state = {
        item: { id: 123 },
        errors: {}
      };
      const action = {
        type: 'BUDGET_ITEM_DELETE_FAILED',
        error: new Error('error')
      };

      equal(budgetItemForm(state, action), state);
    });
  });

  describe('CLOSE_ITEM_FORM', () => {
    it('closes form', () => {
      const state = {
        item: { id: 123 },
        errors: {}
      };

      const { item, errors } = budgetItemForm(state, { type: 'CLOSE_ITEM_FORM' });
      equal(item, null);
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
        budget: { id: 'bar', label: 'label' }
      };

      equal(selectedBudgetId('foo', action), 'bar');
    });
  });
});

describe('budgets', () => {
  describe('BUDGETS_FETCH_SUCCEEDED', () => {
    it('replaces budgets', () => {
      const state = [makeBudget('123')]
      const action = {
        type: 'BUDGETS_FETCH_SUCCEEDED',
        budgets: [makeBudget('234'), makeBudget('345')]
      };

      deepEqual(budgets(state, action), [makeBudget('234'), makeBudget('345')]);
    });
  });

  describe('BUDGETS_FETCH_FAILED', () => {
    it('does not change state', () => {
      const state = [makeBudget('123')];
      const action = {
        type: 'BUDGETS_FETCH_FAILED',
        error: new Error('error')
      };

      equal(budgets(state, action), state);
    });
  });

  describe('BUDGET_SAVE_SUCCEEDED', () => {
    it('adds a budget', () => {
      const state = [makeBudget('123')];
      const action = {
        type: 'BUDGET_SAVE_SUCCEEDED',
        budget: makeBudget('234')
      };

      deepEqual(budgets(state, action), [makeBudget('123'), makeBudget('234')]);
    });
  });

  describe('BUDGET_SAVE_FAILED', () => {
    it('does not change state if error', () => {
      const state = [makeBudget('123')];
      const action = {
        type: 'BUDGET_SAVE_FAILED',
        error: new Error('error')
      };

      deepEqual(budgets(state, action), [makeBudget('123')]);
    });
  });

  describe('BUDGET_DELETE_SUCCEEDED', () => {
    it('deletes a budget', () => {
      const state = [makeBudget('123'), makeBudget('234')];
      const action = {
        type: 'BUDGET_DELETE_SUCCEEDED',
        budget: makeBudget('234')
      };

      deepEqual(budgets(state, action), [makeBudget('123')]);
    });
  });

  describe('BUDGET_DELETE_FAILED', () => {
    it('does not change state', () => {
      const state = [makeBudget('123'), makeBudget('234')];
      const action = {
        type: 'BUDGET_DELETE_FAILED',
        error: new Error('error')
      };

      deepEqual(budgets(state, action), [makeBudget('123'), makeBudget('234')]);
    });
  });
});

describe('budgetItems', () => {
  describe('BUDGET_ITEMS_FETCH_SUCCEEDED', () => {
    it('replaces items', () => {
      const state = [makeBudgetItem('123')];
      const action = {
        type: 'BUDGET_ITEMS_FETCH_SUCCEEDED',
        budgetItems: [makeBudgetItem('234'), makeBudgetItem('345')]
      };

      deepEqual(budgetItems(state, action), [makeBudgetItem('234'), makeBudgetItem('345')]);
    });
  });

  describe('BUDGET_ITEMS_FETCH_FAILED', () => {
    it('does not change state', () => {
      const state = [makeBudgetItem('123')];
      const action = {
        type: 'BUDGET_ITEMS_FETCH_FAILED',
        error: new Error('error')
      };

      equal(budgetItems(state, action), state);
    });
  });

  describe('BUDGET_ITEM_SAVE_SUCCEEDED', () => {
    it('adds item', () => {
      const state = [makeBudgetItem('123')];
      const action = {
        type: 'BUDGET_ITEM_SAVE_SUCCEEDED',
        budgetItem: makeBudgetItem('234')
      };

      deepEqual(budgetItems(state, action), [
        makeBudgetItem('123'),
        makeBudgetItem('234')
      ]);
    });

    it('replaces item', () => {
      const state = [makeBudgetItem('123'), makeBudgetItem('234')];
      const action = {
        type: 'BUDGET_ITEM_SAVE_SUCCEEDED',
        budgetItem: { id: '234', amount: 99999, label: 'foo', date: new Date(2000, 5, 5) }
      };

      deepEqual(budgetItems(state, action), [
        makeBudgetItem('123'),
        { id: '234', amount: 99999, label: 'foo', date: new Date(2000, 5, 5) }
      ]);
    });
  });

  describe('BUDGET_ITEM_SAVE_FAILED', () => {
    it('does not change state', () => {
      const state = [makeBudgetItem('123'), makeBudgetItem('234')];
      const action = {
        type: 'BUDGET_ITEM_SAVE_FAILED',
        error: new Error('error')
      };

      equal(budgetItems(state, action), state);
    });
  });

  describe('BUDGET_ITEM_DELETE_SUCCEEDED', () => {
    it('deletes item', () => {
      const state = [makeBudgetItem('123'), makeBudgetItem('234')];
      const action = {
        type: 'BUDGET_ITEM_DELETE_SUCCEEDED',
        budgetItem: makeBudgetItem('123')
      };
      deepEqual(budgetItems(state, action), [makeBudgetItem('234')]);
    });
  });

  describe('BUDGET_ITEM_DELETE_SUCCEEDED', () => {
    it('does not change state', () => {
      const state = [makeBudgetItem('123')];
      const action = {
        type: 'BUDGET_ITEM_DELETE_FAILED',
        error: new Error('error')
      };

      deepEqual(budgetItems(state, action), [makeBudgetItem('123')]);
    });
  });
});
