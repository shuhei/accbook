import { Component, View, EventEmitter, For, ElementRef } from 'angular2/angular2';
import { Injector } from 'angular2/di';
import { FormDirectives, FormBuilder, ControlGroup } from 'angular2/forms';

import { BudgetItem } from './models';
import { Modal, ModalRef } from './modal';
import { Intent } from './stream';

@Component({
  selector: 'menu-link',
  properties: {
    open: 'open'
  }
})
@View({
  template: `
    <div class="menu-link"
         [class.menu-link--open]="open">
      <span></span>
    </div>
  `
})
export class MenuLink {
  open: boolean;
}

@Component({
  selector: 'budget-item-form'
})
@View({
  directives: [FormDirectives],
  template: `
    <form [control-group]="form">
      <p>
        <label>
          <input type="checkbox" control="isIncome"> Income
        </label>
      </p>
      <p>
        <label>
          Label <input type="text" control="label">
        </label>
      </p>
      <p>
        <label>
          Amount <input type="number" control="amount">
        </label>
      </p>
      <p>
        <label>
          Date <input type="date" control="date">
        </label>
      </p>
      <p>
        <button class="button button--small" type="button" (click)="cancel()">Cancel</button>
        <button class="button button--small" type="button" (click)="save()">Save</button>
      </p>
    </form>
  `
})
export class BudgetItemForm {
  modelRef: ModalRef;
  intent: Intent;
  form: ControlGroup;

  constructor(modalRef: ModalRef, intent: Intent) {
    this.modalRef = modalRef;
    this.intent = intent;

    // TODO: Should we inject FormBuilder?
    // TODO: Validate form.
    this.form = new FormBuilder().group({
      isIncome: [false],
      label: [''],
      amount: [0],
      // TODO: Can't we set Date to date control?
      date: [this._formatDate(new Date())]
    });
  }

  save() {
    const value = this.form.value;
    // TODO: Can't we get Date or number from control?
    const item = new BudgetItem({
      date: new Date(value.date),
      amount: (value.isIncome ? 1 : -1) * parseInt(value.amount),
      label: value.label
    });
    this.intent.createBudgetItem(item);
    this.modalRef.close();
  }

  cancel() {
    this.modalRef.close();
  }

  // TODO: Extract to another module.
  _formatDate(date) {
    const year = date.getFullYear();
    const month = this._pad(date.getMonth() + 1);
    const day = this._pad(date.getDate());
    return `${year}-${month}-${day}`;
  }

  _pad(num: number, digits: number = 2) {
    let str = num.toString();
    while (str.length < digits) {
      str = '0' + str;
    }
    return str;
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
          <button class="button button--small" (^click)="editItem(item)">
            <i class="fa fa-pencil">Edit</i>
          </button>
          <button class="button button--danger button--small" (^click)="deleteItem(item)">
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
  intent: Intent;

  // TODO: Do we really need to inject three arguments to show a modal?
  constructor(modal: Modal, location: ElementRef, injector: Injector, intent: Intent) {
    this.modal = modal;
    this.location = location;
    this.injector = injector;
    this.intent = intent;
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
    this.intent.deleteBudgetItem(item);
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
