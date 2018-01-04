/**
 * Actions for modifing textNodes with textNode Editor 
 */


export const ADD_TEXTNODE = 'ADD_TEXTNODE';
export const UPDATE_TEXTNODE = 'UPDATE_TEXTNODE';

export const addTextNode = ({ textNode }) => ({
	type: ADD_TEXTNODE,
	textNode,
});

export const updateTextNode = ({ textNode }) => ({
	type: UPDATE_TEXTNODE,
	textNode,
});