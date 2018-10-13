import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import reducers from '../reducers';

const history = createBrowserHistory();

export default function configureStore(initialState) {
  const routedReducer = connectRouter(history)(reducers);
  const historyMiddleware = routerMiddleware(history);
  const middleWares = applyMiddleware(historyMiddleware);

  if (process.env.NODE_ENV === 'production') {
    return { store: createStore(routedReducer, initialState, middleWares), history };
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    routedReducer, initialState, 
    composeEnhancers(middleWares)
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  return { store, history }
}
