import { UPDATE_PAGE } from '../actions/pagination';

export default (state = { page: 1 }, action) => {
	switch (action.type) {
	case UPDATE_PAGE:
		return {
			...state,
			page: action.page,
		};
	default:
		return state;
	}
};
