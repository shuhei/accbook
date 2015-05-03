import { Component, View, EventEmitter, For } from 'angular2/angular2';

import { BudgetItem } from './models';

@Component({
  selector: 'menu-link',
  events: ['click'],
  properties: {
    open: 'open'
  }
})
@View({
  template: `
    <div class="menu-link"
         [class.menu-link--open]="open"
         (click)="onClick()">
      <span></span>
    </div>
  `
})
export class MenuLink {
  open: boolean;
  click: EventEmitter;

  constructor() {
    // TODO: Do we need to create EventEmitter even for native DOM event
    // such as click?
    this.click = new EventEmitter();
  }

  onClick() {
    this.click.next('click');
  }
}

@Component({
  selector: 'budget-item-list',
  properties: {
    items: 'items'
  }
})
@View({
  directives: [For],
  template: `
    <div class="budget-item-list">
      <div *for="#item of items; #i = index"
           class="grid-row budget-item"
           [class.budget-item--spending]="isSpending(item)"
           [class.budget-item--income]="isIncome(item)"
           [class.budget-item--deficit]="isDeficit(i)">
        <div class="grid-1-6 budget-item__date">{{item.date | date}}</div>
        <div class="grid-1-6 budget-item__amount">{{item.amount}}</div>
        <div class="grid-1-6 budget-item__total">{{totalUntil(i) | number : 0}}</div>
        <div class="grid-1-4">{{item.label}}</div>
        <div class="grid-1-4 budget-item__tools">
          <button class="button button--small" (click)="edit(item)">
            <i class="fa fa-pencil">Edit</i>
          </button>
          <button class="button button--danger button--small" ng-click="budget.delete(item)">
            <i class="fa fa-remove">Delete</i>
          </button>
        </div>
      </div>
    </div>
    <div class="grid-row budget-total">
      <div class="grid-1-6">Total</div>
      <div class="grid-1-3 budget-item__amount">{{total() | number : 0}}</div>
      <div class="grid-1-2"></div>
    </div>
  `
})
export class BudgetItemList {
  items: Array<BudgetItem>;

  constructor() {
  }

  edit(item: BudgetItem): void {
    console.log('Edit', item);
  }

  total(): number {
    return this.items.reduce((acc: number, item: BudgetItem) => {
      return acc + item.amount;
    }, 0);
  }

  totalUntil(index: number): number {
    return this.items.reduce((acc: number, item: BudgetItem, i: number) => {
      if (i <= index) {
        return acc + item.amount;
      } else {
        return acc;
      }
    }, 0);
  }

  isSpending(item: BudgetItem): boolean {
    return item.amount < 0;
  }

  isIncome(item: BudgetItem): boolean {
    return item.amount > 0;
  }

  isDeficit(index: number): boolean {
    return this.totalUntil(index) < 0;
  }

  _sortItems(): void {
    this.items.sort((a: BudgetItem, b: BudgetItem) => {
      const dateComparison = this._parseDate(a.date) - this._parseDate(b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      return b.amount - a.amount;
    });
  }

  _parseDate(str) {
    if (typeof str.getTime === 'function') {
      return str.getTime();
    }
    if (typeof str === 'string') {
      return Date.parse(str);
    }
    return new Date(9999, 0, 1).getTime();
  }
}
