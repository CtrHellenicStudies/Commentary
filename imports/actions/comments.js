/**
 * Actions for modifing comments with comment editor 
 */

export const ADD_COMMENT = 'ADD_COMMENT';
export const UPDATE_COMMENT = 'UPDATE_COMMENT';

export const addComment = ({ comment }) => ({
	type: ADD_COMMENT,
	comment: comment,
});

export const updateComment = ({ comment }) => ({
	type: UPDATE_COMMENT,
	comment: comment,
});

export const removeComment = ({ comment }) => ({
	type: REMOVE_COMMENT,
	comment: comment,
});
