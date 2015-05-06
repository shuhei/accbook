// keys
import keyMirror from 'keymirror';

export const Keys = keyMirror({
  RECEIVE_BUDGET_ITEMS: null,
  CREATE_BUDGET_ITEM: null,
  UPDATE_BUDGET_ITEM: null,
  DELETE_BUDGET_ITEM: null
});

// TODO: Implement dispatcher for `waitFor()`.

// intent or action
import Rx from 'rx';
import { BudgetItemService } from './services';

// TODO: Create a dispatcher for store dependencies or subject for
// each method.
export class Intent {
  subject: Rx.ReplaySubject;
  budgetItemService: BudgetItemService;

  constructor(budgetItemService: BudgetItemService) {
    this.subject = new Rx.ReplaySubject(1);
    this.budgetItemService = budgetItemService;
  }

  async fetchBudgetItems(): void {
    const items = await this.budgetItemService.read();
    this.subject.onNext({
      key: Keys.RECEIVE_BUDGET_ITEMS,
      items: items
    });
  }

  async createBudgetItem(item: BudgetItem): void {
    const newItem = await this.budgetItemService.create(item);
    this.subject.onNext({
      key: Keys.CREATE_BUDGET_ITEM,
      item: newItem
    });
  }

  async updateBudgetItem(item: BudgetItem): void {
    await this.budgetItemService.update(item);
    this.subject.onNext({
      key: Keys.UPDATE_BUDGET_ITEM,
      item: item
    });
  }

  async deleteBudgetItem(id: number): void {
    await this.budgetItemService.delete(id);
    this.subject.onNext({
      key: Keys.DELETE_BUDGET_ITEM,
      id: id
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

    // TODO: Use immutable data structure.
    this.state = {
      budgetItems: []
    };

    intent.subject.subscribe(this.handlePayload.bind(this));

    // Initial state.
    this.notify();
  }

  receiveBudgetItems(items: Array<BudgetItem>) {
    this.state.budgetItems = items;
    this.notify();
  }

  createBudgetItem(item: BudgetItem): void {
    this.state.budgetItems.push(item);
    this.notify();
  }

  updateBudgetItem(item: BudgetItem): void {
    this.state.budgetItems.forEach((eachItem, i) => {
      if (eachItem.id === item.id) {
        this.state.budgetItems[i] = item;
      }
    });
    this.notify();
  }

  deleteBudgetItem(id: number): void {
    const item = this.state.budgetItems.filter((eachItem) => {
      return eachItem.id === id;
    })[0];
    if (item) {
      const index = this.state.budgetItems.indexOf(item);
      this.state.budgetItems.splice(index, 1);
    }
    this.notify();
  }

  handlePayload(payload): void {
    switch (payload.key) {
      case Keys.RECEIVE_BUDGET_ITEMS:
        this.receiveBudgetItems(payload.items);
        break;
      case Keys.CREATE_BUDGET_ITEM:
        this.createBudgetItem(payload.item);
        break;
      case Keys.UPDATE_BUDGET_ITEM:
        this.updateBudgetItem(payload.item);
        break;
      case Keys.DELETE_BUDGET_ITEM:
        this.deleteBudgetItem(payload.id);
        break;
      default:
        console.warn(`${payload.key} not recognized in model.`);
    }
  }

  notify(): void {
    this.subject.onNext(this.state);
  }
}
