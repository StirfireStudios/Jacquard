import React from 'react';
import ReactDOM from 'react-dom';

import 'typeface-roboto'
import './index.css';

import assignActions from './actions/assign';
import App from './App';
import createStore from './store';

const store = createStore();
assignActions(store.store);

ReactDOM.render(<App store={store.store} history={store.history}/>, document.getElementById('root'));

