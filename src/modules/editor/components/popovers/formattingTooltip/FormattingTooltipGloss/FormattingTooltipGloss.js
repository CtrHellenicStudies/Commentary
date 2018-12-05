import React from 'react'
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

import FormattingTooltipItemButton from '../FormattingTooltipItemButton';


class FormattingTooltipGloss extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	promptForLink(ev) {
		let selection = this.props.editorState.getSelection();
		if (!selection.isCollapsed()) {
			// Toggle link mode
		}
	}

	activeClass() {

		return '';
	}

	render() {
		return (
			<FormattingTooltipItemButton
				className={this.activeClass()}
				onClick={ this.handleClick }
 		>
				<span>gloss</span>
			</FormattingTooltipItemButton>
		)
	}
}

const mapStateToProps = state => ({
	...state.editor,
});

export default connect(
	mapStateToProps,
)(FormattingTooltipGloss);
