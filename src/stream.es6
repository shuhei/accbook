// keys
import keyMirror from 'keymirror';

export const Keys = keyMirror({
  CREATE_BUDGET_ITEM: null,
  UPDATE_BUDGET_ITEM: null,
  DELETE_BUDGET_ITEM: null
});

// intent or action
import Rx from 'rx';

// TODO: Create a dispatcher for store dependencies or subject for
// each method.
export class Intent {
  subject: Rx.ReplaySubject;

  constructor() {
    this.subject = new Rx.ReplaySubject(1);
  }

  createBudgetItem(item: BudgetItem): void {
    this.subject.onNext({
      key: Keys.CREATE_BUDGET_ITEM,
      item: item
    });
  }

  updateBudgetItem(item: BudgetItem): void {
    this.subject.onNext({
      key: Keys.UPDATE_BUDGET_ITEM,
      item: item
    });
  }

  // TODO: Use unique ID instead of object reference.
  deleteBudgetItem(item: BudgetItem): void {
    this.subject.onNext({
      key: Keys.DELETE_BUDGET_ITEM,
      item: item
    });
  }
}

// model or store
import { BudgetItem } from './models';

export class Model {
  subject: Rx.ReplaySubject;
  state: { budgetItems: Array<BudgetItem> };

  constructor(intent: Intent) {
    this.subject = new Rx.ReplaySubject(1);
    // TODO: Remove dummy items.
    // TODO: Use immutable data structure.
    this.state = {
      budgetItems: [
        new BudgetItem({ label: 'Hello', amount: 2400, date: new Date(2015, 5, 1) }),
        new BudgetItem({ label: 'World', amount: 5400, date: new Date(2015, 5, 3) })
      ]
    };

    intent.subject.subscribe(this.handlePayload.bind(this));

    // Initial state.
    this.notify();
  }

  createBudgetItem(item: BudgetItem): void {
    this.state.budgetItems.push(item);
    this.notify();
  }

  updateBudgetItem(item: BudgetItem): void {
    // TODO: Update with ID.
    this.notify();
  }

  deleteBudgetItem(item: BudgetItem): void {
    const index = this.state.budgetItems.indexOf(item);
    if (index >= 0) {
      this.state.budgetItems.splice(index, 1);
    }
    this.notify();
  }

  handlePayload(payload): void {
    switch (payload.key) {
      case Keys.CREATE_BUDGET_ITEM:
        this.createBudgetItem(payload.item);
        break;
      case Keys.UPDATE_BUDGET_ITEM:
        this.updateBudgetItem(payload.item);
        break;
      case Keys.DELETE_BUDGET_ITEM:
        this.deleteBudgetItem(payload.item);
        break;
      default:
        console.warn(`${payload.key} not recognized in model.`);
    }
  }

  notify(): void {
    this.subject.onNext(this.state);
  }
}
