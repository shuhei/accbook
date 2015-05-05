import { Component, Directive, View, Parent, DynamicComponentLoader, ElementRef, NgElement, onDestroy } from 'angular2/angular2';
// HACK: Due to the bug on `angular2/core.js` of alpha.21. Will be fixed on alpha.22.
import { ComponentRef } from 'angular2/src/core/compiler/dynamic_component_loader';
import { bind, Injector, Binding } from 'angular2/di';
import { Type, isPresent } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { DOM } from 'angular2/src/dom/dom_adapter';

// Stolen from https://github.com/angular/angular/commit/f88c4b77cad5bf08bc124115c7f4d92c65c45f7a

// TODO: What are the differences of ElementRef and ComponentRef?
// TODO: What's ElementRef?
// TODO: What's ElementRef used for? DOM-based DI?

export class ModalRef {
  containerRef: ComponentRef;
  _contentRef: ComponentRef;
  isClosed: boolean;
  whenClosedDeferred: any;
  contentRefDeferred: any;

  constructor() {
    this.containerRef = null;
    this._contentRef = null;
    this.isClosed = false;
    this.whenClosedDeferred = PromiseWrapper.completer();
    this.contentRefDeferred = PromiseWrapper.completer();
  }

  set contentRef(value: ComponentRef) {
    this._contentRef = value;
    this.contentRefDeferred.resolve(value);
  }

  get instance() {
    if (isPresent(this._contentRef)) {
      // TODO: What's instance of a ComponentRef? Instance of component class?
      return this._contentRef.instance;
    }

    throw 'No instance yet';
  }

  get whenClosed(): Promise {
    return this.whenClosedDeferred.promise;
  }

  close(result: any = null) {
    this.contentRefDeferred.promise
      .then(() => {
        if (!this.isClosed) {
          this.isClosed = true;
          this.containerRef.dispose();
          this.whenClosedDeferred.resolve(result);
        }
      });
  }
}

// HACK: hostListeners on dynamically loaded component.
// Blocked by https://github.com/angular/angular/issues/1539
@Component({
  selector: 'modal-backdrop',
  hostListeners: {
    'click': 'onClick()'
  },
  // HACK
  lifecycle: [onDestroy]
})
@View({
  template: ''
})
export class ModalBackdrop {
  modalRef: ModalRef;
  // HACK
  element: NgElement;
  boundOnClick: Function;

  constructor(modalRef: ModalRef, element: NgElement) {
    this.modalRef = modalRef;

    // HACK
    this.element = element;
    this.boundOnClick = () => {
      this.onClick();
    };
    this.element.domElement.addEventListener('click', this.boundOnClick, false);
  }

  onClick() {
    this.modalRef.close();
  }

  // HACK
  onDestroy() {
    this.element.domElement.removeEventListener('click', this.boundOnClick);
    this.element = null;
    this.boundOnClick = null;
  }
}

@Component({
  selector: 'modal-container',
  hostListeners: {
    'body:^keydown': 'documentKeypress($event)'
  }
})
@View({
  template: `
    <modal-content></modal-content>
    <div tabindex="0" (focus)="wrapFocus()"></div>
  `,
  // directives: [ModalContent]
})
export class ModalContainer {
  contentRef: ElementRef;
  modalRef: ModalRef;

  constructor() {
    this.contentRef = null;
    this.modalRef = null;
  }

  wrapFocus() {
  }

  documentKeypress(event: KeyboardEvent) {
    console.log('body keypress');
    if (event.keyCode === KEY_ESC) {
      this.modalRef.close();
    }
  }
}

@Directive({
  selector: 'modal-content'
})
export class ModalContent {
  constructor(@Parent() modalContainer: ModalContainer, elementRef: ElementRef) {
    modalContainer.contentRef = elementRef;
  }
}
// HACK: Due to circular reference. ES6 classe declaration doesn't hoist.
ModalContainer.annotations[1].directives = [ModalContent];

export class ModalConfig {
  width: string;
  height: string;
  bindings: Array<Binding>;

  constructor({ width, height, bindings } = {}) {
    this.width = width;
    this.height = height;
    this.bindings = bindings || [];
  }
}

export class Modal {
  componentLoader: DynamicComponentLoader;

  constructor(loader: DynamicComponentLoader) {
    this.componentLoader = loader;
  }

  async open(
    type: Type, elementRef: ElementRef, parentInjector: Injector, options: ModalConfig = null
  ): ModalRef {
    const config = isPresent(options) ? options : new ModalConfig();

    const modalElement = this._createModalElement(config);

    const modalRef = new ModalRef();
    const bindings = [bind(ModalRef).toValue(modalRef), ...config.bindings];
    console.log(config, bindings);
    const contentInjector = parentInjector.resolveAndCreateChild(bindings);

    const backdropRefPromise = this._openBackdrop(elementRef, contentInjector);

    // TODO: Where is ModalContainer loaded into? The div? Is the selector ignored?
    const containerRef =
      await this.componentLoader.loadIntoNewLocation(ModalContainer, elementRef, modalElement);
    modalRef.containerRef = containerRef;

    const contentRef = await this.componentLoader.loadNextToExistingLocation(
      type, containerRef.instance.contentRef, contentInjector
    );
    modalRef.contentRef = contentRef;
    containerRef.instance.modalRef = modalRef;

    backdropRefPromise.then(async (backdropRef) => {
      await modalRef.whenClosed;
      backdropRef.dispose();
    });

    return modalRef;
  }

  _createModalElement(config: ModalConfig) {
    const modalElement = DOM.createElement('div');
    DOM.appendChild(DOM.query('body'), modalElement);
    DOM.addClass(modalElement, 'modal-container');
    DOM.setAttribute(modalElement, 'tabindex', '0');

    if (isPresent(config.width)) {
      DOM.setStyle(modalElement, 'width', config.width);
    }
    if (isPresent(config.height)) {
      DOM.setStyle(modalElement, 'height', config.height);
    }
    return modalElement;
  }

  _openBackdrop(elementRef: ElementRef, injector: Injector) {
    const backdropElement = DOM.createElement('div');
    DOM.addClass(backdropElement, 'modal-backdrop');
    DOM.appendChild(DOM.query('body'), backdropElement);
    return this.componentLoader.loadIntoNewLocation(
      ModalBackdrop, elementRef, backdropElement, injector
    );
  }
}
