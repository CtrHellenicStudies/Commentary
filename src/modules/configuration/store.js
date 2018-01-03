import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import client from './client';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/**
 * data store for redux and react-graphql
 */
const configureStore = (preloadedState) => {
	const store = createStore(
		rootReducer,
		preloadedState,
		composeEnhancers(
			applyMiddleware(thunk, createLogger(), client.middleware()),
		)
	);

	/*
	TODO: Implement tracker for pushing out notifications
  Tracker.autorun(() => {
    store.dispatch({
      type: 'SET_MESSAGES',
      messages: Messages.find().fetch(),
    });
  });
	*/

	return store;
};

export default configureStore;
