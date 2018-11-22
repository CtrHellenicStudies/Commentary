export const SET_EDITOR_REF = 'SET_EDITOR_REF';
export const SET_EDITOR_STATE = 'SET_EDITOR_STATE';
export const SET_TOOLTIP = 'SET_TOOLTIP';
export const SET_ADD_TOOLTIP = 'SET_ADD_TOOLTIP';

export const setEditorRef = editorRef => ({
	type: SET_EDITOR_REF,
	editorRef,
});

export const setEditorState = (editorState) => ({
	type: SET_EDITOR_STATE,
	editorState,
});

export const setTooltip = (tooltip) => ({
	type: SET_TOOLTIP,
	tooltip,
});

export const setAddTooltip = (addTooltip) => ({
	type: SET_ADD_TOOLTIP,
	addTooltip,
});


export default {
	setEditorRef,
	setEditorState,
	setTooltip,
	setAddTooltip,
};
