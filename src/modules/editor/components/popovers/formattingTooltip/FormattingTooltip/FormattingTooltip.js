import React from 'react';
import autobind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';

// components
import LinkTextInput from '../LinkTextInput';
import FormattingTooltipButtons from '../FormattingTooltipButtons';

import hasSelectedText from '../../../../lib/hasSelectedText';
import { showTooltip } from '../../../../lib/handleTooltips';

import './FormattingTooltip.css';


class FormattingTooltip extends React.Component {

	constructor(props) {
		super(props);

		this.tooltipRef = React.createRef();
		this.listeningForClicks = false;

		autobind(this);
	}

	componentDidUpdate(_prevProps) {
		const { 
			editorRef, 
			editorState, 
			setFormattingTooltip, 
			tooltip 
		} = this.props;
		const canShowTooltip = (
			hasSelectedText(editorState) &&
      editorState.getSelection().getHasFocus()
		);

		if (!tooltip.visible && canShowTooltip) {
			showTooltip(tooltip, editorRef, setFormattingTooltip);
		}
	}

	renderFormattingTooltipContent() {
		const { tooltip } = this.props;

		switch (tooltip.mode) {
		case 'buttons':
			return <FormattingTooltipButtons />
		case 'link':
			return <LinkTextInput />
		default:
			return <FormattingTooltipButtons />
		}
	}

	render() {
		const { tooltip } = this.props;

		return (
			<div
				ref={this.tooltipRef}
				className={`
					formattingTooltip
					${tooltip.visible ? 'formattingTooltipVisible' : ''}
				`}
				style={tooltip.position}
			>
				{this.renderFormattingTooltipContent()}
			</div>
		);
	}
}


const mapStateToProps = state => ({
	...state.editor,
});

const mapDispatchToProps = dispatch => ({
	setFormattingTooltip: (tooltip) => {
		dispatch(editorActions.setTooltip(tooltip));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(FormattingTooltip);
