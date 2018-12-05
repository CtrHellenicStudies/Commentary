/**
 * Initial redux integration, to be extended in subsequent stages of the project
 */


import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';

import client from '../client';
import * as ActionTypes from '../../actions';

import comments from './comments';
import textNodes from './textNodes';

const errorMessage = (state = null, action) => {
	const {type, error} = action;

	if (type === ActionTypes.RESET_ERROR_MESSAGE) {
		return null;
	} else if (error) {
		return error;
	}

	return state;
};

const rootReducer = combineReducers({
	form: formReducer,
	errorMessage,
	apollo: client.reducer(), // graphql data
	routing: routerReducer,
	comments,
	textNodes,
});

export default rootReducer;
