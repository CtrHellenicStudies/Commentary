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
import CommentCitation from '../../../../../comments/components/CommentEditor/CommentCitation';


import './LemmaInput.css';


class LemmaInput extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleInputEnter(e) {
		if (e.which === 13) {
			this.createLemma(e)
		}
	}

	disableLemmaMode() {
		const { tooltip, setTooltip } = this.props;
		setTooltip({ ...tooltip, mode: 'buttons' });
	}

	createLemma(e) {
		e.preventDefault();

		let { editorState, setEditorState } = this.props;
		const url = e.currentTarget.value;

		const contentState = editorState.getCurrentContent();
		const selectionState = editorState.getSelection();
		const contentStateWithEntity = contentState.createEntity(
			'LEMMA',
			'MUTABLE',
			{ url },
		);
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		const contentStateWithLemma = Modifier.applyEntity(
			contentStateWithEntity,
			selectionState,
			entityKey
		);

		const newEditorState = EditorState.createWithContent(contentStateWithLemma, decorators);
		// TODO: Investigate EditorState.push(editorState, contentStateWithLemma) instead;

		setEditorState(newEditorState);
		this.disableLemmaMode(e);
	}

	render() {
		return (
			<div className="lemmaInput">
				<CommentCitation />
				<button className="lemmaInputAdd">
					Add
				</button>
				<i
					className="mdi mdi-close"
					onClick={this.disableLemmaMode}
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
)(LemmaInput);
