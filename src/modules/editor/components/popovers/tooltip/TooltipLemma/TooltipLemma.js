import React from 'react'
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';

// component
import TooltipItemButton from '../TooltipItemButton';


class TooltipLemma extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	async promptForLemma(e) {
		e.preventDefault();
		const { setTooltip, tooltip } = this.props;
		await setTooltip({ ...tooltip, mode: 'lemma' });
	}

	isActive() {
		const { editorState } = this.props;

		if (!editorState) {
			return null;
		}

		let selection = editorState.getSelection();
		let activeBlockType = editorState
			.getCurrentContent()
			.getBlockForKey(selection.getStartKey())
			.getType();
		return 'LINK' === activeBlockType;
	}

	render() {
		return (
			<TooltipItemButton
				className={`${this.isActive() ? 'active' : ''}`}
				onClick={this.promptForLemma}
	 		>
				<i className="mdi mdi-alpha" />
			</TooltipItemButton>
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
)(TooltipLemma);
