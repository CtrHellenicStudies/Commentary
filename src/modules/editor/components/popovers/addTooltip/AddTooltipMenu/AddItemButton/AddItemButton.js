import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipMenuItemButton from '../../AddTooltipMenuItemButton';

// icons
import { MdInsertDriveFile } from "react-icons/md";

class AddItemButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleAddItem() {

	}

	render() {
		return (
			<AddTooltipMenuItemButton
				className="AddTooltipMenuItemButtonDisabled"
				onClick={this.handleAddItem}
			>
				<MdInsertDriveFile />
				<span>Item</span>
			</AddTooltipMenuItemButton>
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
