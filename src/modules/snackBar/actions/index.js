/*
 * action types
 */
export const HANDLE_SET_SNACK = 'HANDLE_SET_SNACK';
export const HANDLE_REQUEST_CLOSE_SNACK = 'HANDLE_REQUEST_CLOSE_SNACK';


/*
 * action creators
 */
export const handleSetSnack = ({ message }) => ({
	type: HANDLE_SET_SNACK,
	message,
	open: true,
});

export const handleRequestCloseSnack = () => ({
	type: HANDLE_REQUEST_CLOSE_SNACK,
	open: false,
});
