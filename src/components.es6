import { Component, View, EventEmitter, For, ElementRef } from 'angular2/angular2';
import { Injector } from 'angular2/di';

import { BudgetItem } from './models';
import { Modal, ModalRef } from './modal';

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
  selector: 'budget-item-form'
})
@View({
  template: `
    <form>
      <label>Label</label>
      <br>
      <input type="text">
      <br>
      <label>Amount</label>
      <br>
      <input type="number">
      <br>
      <label>Date</label>
      <br>
      <input type="date">
      <br>
      <button class="button button--small" type="button" (click)="cancel()">Cancel</button>
      <button class="button button--small" type="button" (click)="save()">Save</button>
    </form>
  `
})
export class BudgetItemForm {
  modelRef: ModalRef;

  constructor(modalRef: ModalRef) {
    this.modalRef = modalRef;
  }

  save() {
    // TODO: Save item.
    this.modalRef.close();
  }

  cancel() {
    this.modalRef.close();
  }
}

@Component({
  selector: 'budget-item-list',
  properties: {
    items: 'items'
  },
  injectables: [Modal]
})
@View({
  directives: [For],
  template: `
    <p>
      <button class="button button--small" (click)="createNewItem()">New</button>
    </p>
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
          <button class="button button--small" (click)="editItem(item)">
            <i class="fa fa-pencil">Edit</i>
          </button>
          <button class="button button--danger button--small" (click)="deleteItem(item)">
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
  modal: Modal;
  location: ElementRef;
  injector: Injector;

  constructor(modal: Modal, location: ElementRef, injector: Injector) {
    this.modal = modal;
    this.location = location;
    this.injector = injector;
  }

  // TODO: Make it work. Because of <template>?
  editItem(item: BudgetItem): void {
    console.log('edit item', item);
    (async () => {
      // TODO: Pass the item via injector. Or add resolve param to open()?
      const modalRef = await this.modal.open(BudgetItemForm, this.location, this.injector);
      await modalRef.whenClosed;
      console.log('edit modal closed');
    })();
  }

  deleteItem(item: BudgetItem): void {
    console.log('delete item', item);
  }

  // We cannot use async method here because it returns a promise but event handler is
  // expected to return boolean or nothing.
  createNewItem(): void {
    (async () => {
      const modalRef = await this.modal.open(BudgetItemForm, this.location, this.injector);
      await modalRef.whenClosed;
      console.log('new modal closed');
    })();
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
