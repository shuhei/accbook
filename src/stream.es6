// keys
import keyMirror from 'keymirror';

export const Keys = keyMirror({
  CREATE_BUDGET_ITEM: null
});

// intent or action
import Rx from 'rx';

const intentSubject = new Rx.ReplaySubject(1);

export const Intent = {
  subject: intentSubject,
  createBudgetItem(item) {
    intentSubject.onNext({
      key: Keys.CREATE_BUDGET_ITEM,
      item: item
    });
  }
};

// model or store
import { BudgetItem } from './models';

// TODO: Use class.
const subject = new Rx.ReplaySubject(1);
const state = {
  budgetItems: [
    new BudgetItem({ label: 'Hello', amount: 2400, date: new Date(2015, 5, 1) }),
    new BudgetItem({ label: 'World', amount: 5400, date: new Date(2015, 5, 3) })
  ]
};
function createBudgetItem(item) {
  // TODO: Use immutable data structure.
  state.budgetItems.push(item);
  subject.onNext(state);
}
Intent.subject.subscribe((payload) => {
  switch (payload.key) {
    case Keys.CREATE_BUDGET_ITEM:
      createBudgetItem(payload.item);
      break;
    default:
      console.warn(`${payload.key} not recognized in model.`);
  }
});
// Initial state.
subject.onNext(state);
export const Model = {
  subject: subject
};
