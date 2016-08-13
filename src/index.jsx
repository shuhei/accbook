/* @flow */
/* global PARSE_APP_ID, PARSE_JS_API_KEY */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import RedBox from 'redbox-react';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import Parse from 'parse';

import 'font-awesome/css/font-awesome.css';
import './css/index.css';
import reducers from './reducers';
import sagas from './sagas';
import App from './containers/App';
import { checkCurrentUser } from './actions';

Parse.initialize(PARSE_APP_ID, PARSE_JS_API_KEY);

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const enhancer = compose(
  applyMiddleware(thunk, promise, sagaMiddleware, logger),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);
const store = createStore(reducers, enhancer);
sagaMiddleware.run(sagas);
store.dispatch(checkCurrentUser());

function renderApp() {
  ReactDOM.render(
    <AppContainer errorReporter={RedBox}>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
}

renderApp();
if (module.hot) {
  module.hot.accept('./containers/App', renderApp);
}
