import * as types from '../actions';

const initialState = {
	message: '',
	open: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
	case types.HANDLE_SET_SNACK: {
		return {
			...state,
			message: action.message,
			open: action.open,
		};
	}
	case types.HANDLE_REQUEST_CLOSE_SNACK: {
		return {
			...state,
			open: action.open,
		};
	}
	default:
		return state;
	}
};
