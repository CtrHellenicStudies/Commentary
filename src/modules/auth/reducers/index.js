import * as types from '../actions';

const initialState = {
	showAuthModal: false,
	authMode: 'login',
};

const getShowAuthModal = (state, action) => {
	if (typeof action.value !== 'undefined' && typeof action.value === 'boolean') {
		return action.value;
	}
	return !state.showAuthModal;
};

export default (state = initialState, action) => {
	switch (action.type) {
	case types.CHANGE_AUTH_MODE: {
		return {
			...state,
			authMode: action.authMode,
		};
	}
	case types.TOGGLE_AUTH_MODAL: {
		return {
			...state,
			authMode: initialState.authMode,
			showAuthModal: getShowAuthModal(state, action),
		};
	}
	case types.TOGGLE_LOGOUT: {
		return {
			...state,
			authMode: 'logout',
			showAuthModal: typeof action.value !== 'undefined' ? action.value : !state.showAuthModal,
		};
	}
	case types.SET_USER: {
		return {
			...state,
			username: action.username,
			userId: action.userId,
			roles: action.roles,
			commenters: action.commenters
		};
	}
	case types.REMOVE_USER: {
		return {
			...state,
			username: null,
			userId: null,
			roles: null,
			commenters: null
		};
	}
	default:
		return state;
	}
};
