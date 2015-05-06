import { window } from 'angular2/src/facade/browser';
import { BudgetItem } from './models';

const localStorage = window.localStorage;

function values(obj) {
  return Object.keys(obj).map((key) => obj[key]);
}

const BUDGET_ITEMS = 'budgetItems.budgetItems';
const BUDGET_ITEMS_LAST_ID = 'budgetItems.lastId';

export class BudgetItemService {
  constructor() {
    this._restore();
  }

  async read(): Array<BudgetItem> {
    return values(this.budgetItems);
  }

  async create(item: BudgetItem): BudgetItem {
    item.id = ++this.lastId;
    this.budgetItems[item.id] = item;
    this._save();
    return item;
  }

  async update(item: BudgetItem): BudgetItem {
    this.budgetItems.set(item.id, item);
    this._save();
    return item;
  }

  async delete(id: number): boolean {
    const result = this.budgetItems.delete(id);
    this._save();
    return result;
  }

  _save() {
    localStorage.setItem(BUDGET_ITEMS, JSON.stringify(this.budgetItems));

    localStorage.setItem(BUDGET_ITEMS_LAST_ID, this.lastId);
  }

  _restore() {
    const items = JSON.parse(localStorage.getItem(BUDGET_ITEMS) || '{}');
    for (let id in items) {
      items[id] = BudgetItem.deserialize(items[id]);
    }
    this.budgetItems = items;

    this.lastId = parseInt(localStorage.getItem(BUDGET_ITEMS_LAST_ID) || '0');
  }
}

export class BudgetService {
}
