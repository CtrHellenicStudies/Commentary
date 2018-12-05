/**
 * Resolvers for modifing textNodes 
 */

import * as types from '../../actions/textNodes';

export default (state = [], action) => {
	switch (action.type) {
	case types.UPDATE_TEXTNODE:
		return {
			...state,
			textNode: action.textNode,
		};
	default:
		return state;
	}
};
