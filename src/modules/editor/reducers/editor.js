import {
	EditorState
} from 'draft-js';


import * as types from '../actions';
import decorators from '../components/decorators';


const defaultState = {
	readOnly: false,
	editorRef: null,
	editorState: EditorState.createEmpty(decorators),
	tooltip: {
		visible: false,
		position: {
			top: 0,
			left: 0,
		},
		mode: 'buttons', // buttons, link, limc
	},
	addTooltip: {
		visible: false,
		menuVisible: false,
		position: {
			// defaults for the initial click to focus to editor not containing a
			// selection that we can get a rect from
			top: 7,
			left: -40,
		},
	},
};

export default (state = defaultState, action) => {
	switch (action.type) {
	case types.SET_EDITOR_REF:
		return {
			...state,
			editorRef: action.editorRef,
		};
	case types.SET_EDITOR_STATE:
		return {
			...state,
			editorState: action.editorState,
		};
	case types.SET_TOOLTIP:
		return {
			...state,
			tooltip: action.tooltip,
		};
	case types.SET_ADD_TOOLTIP:
		return {
			...state,
			addTooltip: action.addTooltip,
		};
	default:
		return state;
	}
};
