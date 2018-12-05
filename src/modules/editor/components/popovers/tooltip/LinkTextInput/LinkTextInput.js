import React from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';

import {
	Modifier,
	EditorState,
} from 'draft-js';

// redux
import editorActions from '../../../../actions';

// components
import decorators from '../../../decorators';


import './LinkTextInput.css';


class LinkTextInput extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleInputEnter(e) {
		if (e.which === 13) {
			this.createLink(e)
		}
	}

	disableLinkMode() {
		const { tooltip, setTooltip } = this.props;
		setTooltip({ ...tooltip, mode: 'buttons' });
	}

	createLink(e) {
		e.preventDefault();

		let { editorState, setEditorState } = this.props;
		const url = e.currentTarget.value;

		const contentState = editorState.getCurrentContent();
		const selectionState = editorState.getSelection();
		const contentStateWithEntity = contentState.createEntity(
			'LINK',
			'MUTABLE',
			{ url },
		);
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		const contentStateWithLink = Modifier.applyEntity(
			contentStateWithEntity,
			selectionState,
			entityKey
		);

		const newEditorState = EditorState.createWithContent(contentStateWithLink, decorators);
		// TODO: Investigate EditorState.push(editorState, contentStateWithLink) instead;

		setEditorState(newEditorState);
		this.disableLinkMode(e);
	}

	render() {
		return (
			<div className="linkTextInput">
				<input
					placeholder="https://example.edu/"
					onKeyPress={this.handleInputEnter}
					defaultValue=""
				/>
				<i
					className="mdi mdi-close"
					onClick={this.disableLinkMode}
				/>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	...state.editor,
});

const mapDispatchToProps = dispatch => ({
	setTooltip: (tooltip) => {
		dispatch(editorActions.setTooltip(tooltip));
	},
	setEditorState: (editorState) => {
		dispatch(editorActions.setEditorState(editorState));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(LinkTextInput);
