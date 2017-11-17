/**
 * Resolvers for modifing comments with comment editor 
 */

import * as types from '../actions/comments';

export default (state = [], action) => {
	switch (action.type) {
	case types.UPDATE_COMMENT:
		return {
			...state,
			comment: action.comment,
		};
	default:
		return state;
	}
};
