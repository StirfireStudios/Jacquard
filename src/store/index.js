import { createStore, compose } from 'redux';

import reducers from '../reducers';

export default function configureStore(initialState) {
  if (process.env.NODE_ENV === 'production') {
    return createStore(reducers, initialState);
  }
  
  const store = createStore(
    reducers, initialState, 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
