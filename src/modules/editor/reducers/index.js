import { combineReducers } from 'redux';

import editorReducers from './editor';


const rootReducer = combineReducers({
	editor: editorReducers,
});


export default rootReducer;
