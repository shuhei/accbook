/* @flow */
/* global PARSE_APP_ID, PARSE_JS_API_KEY */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
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
import { checkCurrentUser } from './actions';

Parse.initialize(PARSE_APP_ID, PARSE_JS_API_KEY);

const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(
  applyMiddleware(thunk, promise, sagaMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);
const store = createStore(reducers, enhancer);
sagaMiddleware.run(sagas);
store.dispatch(checkCurrentUser());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// FIXME: Click on overlay doesn't close the modal.
// Because of using exenv instead of fbjs?
// FIXME: We shouldn't need this.
Modal.setAppElement(document.getElementsByTagName('body')[0]);
Modal.injectCSS();
