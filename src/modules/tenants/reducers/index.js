
import * as types from '../actions';

const initialState = {
	tenantId: null,
};

export default (state = initialState, action) => {
	switch (action.type) {
	case types.SET_TENANT_ID: {
		return {
			...state,
			tenantId: action.tenantId,
		};
	}
	default:
		return state;
	}
}
