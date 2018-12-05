import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipButton from '../../AddTooltipButton';


class AddItemButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleToggleAddItemMenu() {
		const { addTooltip, setAddTooltip } = this.props;
		setAddTooltip({ ...addTooltip, itemMenuVisible: true });
	}

	render() {
		return (
			<AddTooltipButton
				onClick={this.handleToggleAddItemMenu}
			>
				<i className="mdi mdi-image-filter" />
			</AddTooltipButton>
		);
	}
}

const mapStateToProps = state => ({
	...state.editor,
});

const mapDispatchToProps = dispatch => ({
	setEditorState: (editorState) => {
		dispatch(editorActions.setEditorState(editorState));
	},
	setAddTooltip: (addTooltip) => {
		dispatch(editorActions.setAddTooltip(addTooltip));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddItemButton);
