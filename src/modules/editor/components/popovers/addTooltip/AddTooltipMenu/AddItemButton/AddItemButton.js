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

	handleAddItem() {

	}

	render() {
		return (
			<AddTooltipButton
				onClick={this.handleAddItem}
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
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddItemButton);
