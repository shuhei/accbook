import 'babel-core/polyfill';

import { Component, View, EventEmitter, bootstrap } from 'angular2/angular2';
import { bind } from 'angular2/di';
import { Router } from 'angular2/router';
import { RootRouter } from 'angular2/src/router/router';
import { Pipeline } from 'angular2/src/router/pipeline';

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
class MenuLink {
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
  selector: 'accbook-app'
})
@View({
  directives: [MenuLink],
  template: `
    <div class="wrapper"
         [class.wrapper--open]="menuOpen">
      <menu-link (click)="toggleMenu()" [open]="menuOpen"></menu-link>

      <div class="menu-bar">
        <ul class="menu-bar__list">
          <li>Budget 1</li>
          <li>Budget 2</li>
        </ul>
      </div>

      <div class="main">
        <h1>Accbook!</h1>
      </div>
    </div>
  `
})
class AccbookApp {
  constructor() {
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}

bootstrap(AccbookApp, [
  bind(Router).toValue(new RootRouter(new Pipeline()))
]);
