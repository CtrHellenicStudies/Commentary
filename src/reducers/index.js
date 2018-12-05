import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import bricks from './bricks';
import leftMenu from './leftMenu';
import pagination from './pagination';
import authReducers from '../modules/auth/reducers';
import tenantReducers from '../modules/tenants/reducers';
import snackReducers from '../modules/snackBar/reducers';
import editorReducers from '../modules/editor/reducers';
import client from '../middleware/apolloClient';


import * as ActionTypes from '../actions';


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
	bricks,
	leftMenu,
	pagination,
	auth: authReducers,
	tenant: tenantReducers,
	snackbar: snackReducers,
	editor: editorReducers,
});

export default rootReducer;
