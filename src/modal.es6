import { Component, Directive, View, Parent, DynamicComponentLoader, ElementRef, NgElement, onDestroy } from 'angular2/angular2';
// HACK: Due to the bug on `angular2/core.js` of alpha.21. Will be fixed on alpha.22.
import { ComponentRef } from 'angular2/src/core/compiler/dynamic_component_loader';
import { bind, Injector } from 'angular2/di';
import { Type, isPresent } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { DOM } from 'angular2/src/dom/dom_adapter';

// Stolen from https://github.com/jelbourn/angular/blob/md-dialog/modules/angular2_material/src/components/dialog/dialog.js

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

export class Modal {
  componentLoader: DynamicComponentLoader;

  constructor(loader: DynamicComponentLoader) {
    this.componentLoader = loader;
  }

  open(type: Type, elementRef: ElementRef, parentInjector: Injector): Promise {
    const modalElement = DOM.createElement('div');
    DOM.appendChild(DOM.query('body'), modalElement);
    DOM.addClass(modalElement, 'modal-container');

    DOM.setAttribute(modalElement, 'tabindex', '0');

    const modalRef = new ModalRef();
    const contentInjector = parentInjector.resolveAndCreateChild([
      bind(ModalRef).toValue(modalRef)
    ]);

    const backdropRefPromise = this._openBackdrop(elementRef, contentInjector);

    // TODO: Where is ModalContainer loaded into? The div? Is the selector ignored?
    return this.componentLoader.loadIntoNewLocation(ModalContainer, elementRef, modalElement)
      .then((containerRef) => {
        modalRef.containerRef = containerRef;

        // TODO: Don't nest then.
        return this.componentLoader.loadNextToExistingLocation(
          type, containerRef.instance.contentRef, contentInjector
        ).then((contentRef) => {
          modalRef.contentRef = contentRef;
          containerRef.instance.modalRef = modalRef;

          backdropRefPromise.then((backdropRef) => {
            modalRef.whenClosed.then(() => {
              backdropRef.dispose();
            });
          });

          return modalRef;
        });
      });
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
