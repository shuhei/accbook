import 'babel-core/polyfill';

import { Component, View, bootstrap } from 'angular2/angular2';
import { bind } from 'angular2/di';
import { PipeRegistry } from 'angular2/change_detection';
import { Router } from 'angular2/router';
import { RootRouter } from 'angular2/src/router/router';
import { Pipeline } from 'angular2/src/router/pipeline';

import { pipes } from './pipes';
import { BudgetItem } from './models';
import { MenuLink, BudgetItemList } from './components';

import { Model, Intent } from './stream';

@Component({
  selector: 'accbook-app'
})
@View({
  directives: [MenuLink, BudgetItemList],
  template: `
    <div class="wrapper"
         [class.wrapper--open]="menuOpen">
      <menu-link (^click)="toggleMenu()" [open]="menuOpen"></menu-link>

      <div class="menu-bar">
        <ul class="menu-bar__list">
          <li>Budget 1</li>
          <li>Budget 2</li>
        </ul>
      </div>

      <div class="main">
        <h1>Accbook!</h1>
        <budget-item-list [items]="items" [counter]="counter"></budget-item-list>
      </div>

    </div>
  `
})
class AccbookApp {
  menuOpen: boolean;
  items: Array<BudgetItem>;

  constructor(model: Model) {
    this.menuOpen = false;

    model.subject.subscribe((state) => {
      this.items = state.budgetItems;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}

bootstrap(AccbookApp, [
  bind(Router).toValue(new RootRouter(new Pipeline())),
  bind(PipeRegistry).toValue(new PipeRegistry(pipes)),
  Model,
  Intent
]);
