import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

import {
	RichUtils,
} from 'draft-js';

import { MdTitle } from "react-icons/md";
import { MdFormatBold } from "react-icons/md";
import { MdFormatItalic } from "react-icons/md";
import { MdFormatQuote } from "react-icons/md";

// redux
import editorActions from '../../../../actions';

// components
import FormattingTooltipItemButton from '../FormattingTooltipItemButton';


class FormattingTooltipItem extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleClick(e) {
		const { inlineStyle, blockType, tooltip, setTooltip } = this.props;

		e.preventDefault();

		// handle toggling block/inline type
		if (inlineStyle) {
			this._handleToggleInlineStyle()
		} else if (blockType) {
			this._handleToggleBlock();
		}

		// TODO: (charles) do we want to close the tooltip
		// after clicking something? Might it be better to
		// keep it open for changes? 
		setTooltip({ ...tooltip, visible: false });
	}

	_handleToggleInlineStyle() {
		const { editorState, inlineStyle, setEditorState } = this.props;

		setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
	}


	_handleToggleBlock() {
		const { editorState, blockType, setEditorState } = this.props;

		setEditorState(RichUtils.toggleBlockType(editorState, blockType));
	}

	isActive() {
		const { inlineStyle, blockType } = this.props;

		if (inlineStyle) {
			return this.activeClassBlock();
		} else if (blockType) {
			return this.activeClassInline();
		}
	}

	activeClassInline() {
		const { editorState } = this.props;

		if (!editorState) {
			return null;
		}

		return editorState.getCurrentInlineStyle().has(this.props.style);
	}

	activeClassBlock() {
		const { editorState, blockType } = this.props;

		if (!editorState) {
			return null;
		}

		let selection = editorState.getSelection();
		let activeBlockType = editorState
			.getCurrentContent()
			.getBlockForKey(selection.getStartKey())
			.getType();
		return blockType === activeBlockType;
	}

	getIcon(name) {
		// console.log('name is ' + name);
		switch(name) {
		case 'format-title':
			return <MdTitle />;
		case 'format-bold':
			return <MdFormatBold />;
		case 'format-italic':
			return <MdFormatItalic />;
		case 'format-blockquote':
			return <MdFormatQuote />;
		default:
			return;
		}
	}

	render() {
		return (
			<FormattingTooltipItemButton
				className={`${this.isActive() ? 'active' : ''}`}
				onClick={this.handleClick}
			>
				{this.getIcon(this.props.icon)}
			</FormattingTooltipItemButton>
		)
	}
}

const mapStateToProps = state => ({
	...state.editor,
});


const mapDispatchToProps = dispatch => ({
	setEditorState: (editorState) => {
		dispatch(editorActions.setEditorState(editorState));
	},
	setTooltip: (tooltip) => {
		dispatch(editorActions.setTooltip(tooltip));
	},
});


export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FormattingTooltipItem);
