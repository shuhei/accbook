/* @flow */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { Provider } from 'react-redux';
import Parse from 'parse';

import 'font-awesome/css/font-awesome.css';
import './css/index.css';
import reducers from './reducers';
import sagas from './sagas';
import App from './containers/App';

Parse.initialize(PARSE_APP_ID, PARSE_JS_API_KEY);

const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(
  applyMiddleware(thunk, promise, sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);
const store = createStore(reducers, enhancer);
sagaMiddleware.run(sagas);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
