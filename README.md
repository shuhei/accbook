# accbook

My experimental app using Elm.

The app itself is to keep my budget under control. There are many accounting apps out there but most of them focus on keeping track of spent money instead of planning money to be spent. This app records future spendings and tells me whether I'm going to run out of my budget.

## Development

Install dependencies:

```
npm install
elm package install
```

Run API server:

```
npm start
```

Run dev server:

```
npm run dev
```

Open http://localhost:8000 with your browser.

## Design Choices

- Router: [Hop](https://github.com/sporto/hop)
- Parent/Child communication: Flat structure (don't do parent/child communication)
  - http://folkertdev.nl/blog/elm-child-parent-communication/
  - http://folkertdev.nl/blog/elm-child-parent-communication-conti/)
  - https://medium.com/@alex.lew/the-translator-pattern-a-model-for-child-to-parent-communication-in-elm-f4bfaa1d3f98#.4tl2z86i9
