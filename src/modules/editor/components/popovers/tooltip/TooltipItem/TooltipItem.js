import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

import {
	RichUtils,
} from 'draft-js';

// redux
import editorActions from '../../../../actions';

// components
import TooltipItemButton from '../TooltipItemButton';


class TooltipItem extends React.Component {

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

	render() {
		return (
			<TooltipItemButton
				className={`${this.isActive() ? 'active' : ''}`}
				onClick={this.handleClick}
			>
				<i
					className={`tooltipItemIcon mdi mdi-${this.props.icon}`}
				/>
			</TooltipItemButton>
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
)(TooltipItem);
