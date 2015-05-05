// keys
import keyMirror from 'keymirror';

export const Keys = keyMirror({
  CREATE_BUDGET_ITEM: null
});

// intent or action
import Rx from 'rx';

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
}

// model or store
import { BudgetItem } from './models';

export class Model {
  subject: Rx.ReplaySubject;
  state: { budgetItems: Array<BudgetItem> };

  constructor(intent: Intent) {
    this.subject = new Rx.ReplaySubject(1);
    // TODO: Remove dummy items.
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
    // TODO: Use immutable data structure.
    this.state.budgetItems.push(item);
    this.notify();
  }

  handlePayload(payload): void {
    switch (payload.key) {
      case Keys.CREATE_BUDGET_ITEM:
        this.createBudgetItem(payload.item);
        break;
      default:
        console.warn(`${payload.key} not recognized in model.`);
    }
  }

  notify(): void {
    this.subject.onNext(this.state);
  }
}
