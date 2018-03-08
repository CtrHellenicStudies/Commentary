export const UPDATE_PAGE = 'UPDATE_PAGE';

/**
 * Update page action
 * ONLY use when not possible to pass page through router
 */
export const updatePage = page => ({
	type: UPDATE_PAGE,
	page,
});
