import React from 'react';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';

// components
import LinkTextInput from '../LinkTextInput';
import LemmaInput from '../LemmaInput';
import TooltipButtons from '../TooltipButtons';

import './Tooltip.css';


class Tooltip extends React.Component {

	renderTooltipContent() {
		const { tooltip } = this.props;

		switch (tooltip.mode) {
		case 'buttons':
			return <TooltipButtons />
		case 'link':
			return <LinkTextInput />
		case 'lemma':
			return <LemmaInput />
		default:
			return <TooltipButtons />
		}
	}

	render() {
		const { tooltip } = this.props;

		return (
			<div
				className={`
					chsTooltip
					${tooltip.visible ? 'tooltipVisible' : ''}
				`}
				style={tooltip.position}
			>
				{this.renderTooltipContent()}
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
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Tooltip);
