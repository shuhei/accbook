# (WIP) accbook

My experimental app using:

- [Angular 2](https://github.com/angular/angular)
- ES6 + ES7 async/await by [babel](https://github.com/babel/babel)
- AtScript-like @/type annotations including formal parameter decorators by [babel-plugin-angular2-annotations](https://github.com/shuhei/babel-plugin-angular2-annotations)
- Runtime type by [babel-plugin-type-assertion](https://github.com/shuhei/babel-plugin-type-assertion)
- [RxJS](https://github.com/Reactive-Extensions/RxJS)
- Flux-like architecture

The app itself is to keep my budget under control. There are many accounting apps out there but most of them focus on keeping track of spent money instead of planning money to be spent. This app records future spendings and tells me if I'm going to run out of my budget.

## Development

Install dependencies

```
npm install
```

Build assets into `public` directory

```
make
```

Or watch file changes

```
make watch
```
