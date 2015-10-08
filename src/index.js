import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import { Provider } from 'react-redux';
import Parse from 'parse';

import 'font-awesome/css/font-awesome.css';
import './css/index.css';
import reducers from './reducers';
import App from './containers/App';

Parse.initialize(PARSE_APP_ID, PARSE_JS_API_KEY);

const createStoreWithMiddleware = applyMiddleware(thunk, promise)(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
