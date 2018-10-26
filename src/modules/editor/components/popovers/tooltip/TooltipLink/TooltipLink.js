import React from 'react'
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';

// component
import TooltipItemButton from '../TooltipItemButton';


class TooltipLink extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	async promptForLink(e) {
		e.preventDefault();
		const { setTooltip, tooltip } = this.props;
		await setTooltip({ ...tooltip, mode: 'link' });
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
				onClick={this.promptForLink}
	 		>
				<i className="mdi mdi-link" />
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
)(TooltipLink);
