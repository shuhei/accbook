import 'babel-core/polyfill';

import { Component, View, bootstrap } from 'angular2/angular2';
import { bind } from 'angular2/di';
import { Router } from 'angular2/router';
import { RootRouter } from 'angular2/src/router/router';
import { Pipeline } from 'angular2/src/router/pipeline';

@Component({
  selector: 'accbook-app'
})
@View({
  template: `
    <h1>Accbook!</h1>
  `
})
class AccbookApp {
}

bootstrap(AccbookApp, [
  bind(Router).toValue(new RootRouter(new Pipeline()))
]);
