import 'babel-core/polyfill';

import { Component, View, EventEmitter, bootstrap } from 'angular2/angular2';
import { bind } from 'angular2/di';
import { Router } from 'angular2/router';
import { RootRouter } from 'angular2/src/router/router';
import { Pipeline } from 'angular2/src/router/pipeline';

@Component({
  selector: 'menu-link',
  events: ['click']
})
@View({
  template: `
    <div class="menu-link" (click)="onClick()">
      <span></span>
    </div>

    <style>
      @import 'app.css';
    </style>
  `
})
class MenuLink {
  constructor() {
    // TODO: Do we need to create EventEmitter even for native DOM event
    // such as click?
    this.click = new EventEmitter();
  }

  onClick() {
    console.log('ssssss');
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
         [class.wrapper--menu-close]="!menuOpen"
         [class.wrapper--menu-open]="menuOpen">
      <menu-link (click)="toggleMenu()"></menu-link>

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

    <style>
      menu-link {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        z-index: 10;
      }
    </style>
  `
})
class AccbookApp {
  constructor() {
    this.menuOpen = false;
  }

  toggleMenu() {
    console.log('toggle');
    this.menuOpen = !this.menuOpen;
  }
}

bootstrap(AccbookApp, [
  bind(Router).toValue(new RootRouter(new Pipeline()))
]);
