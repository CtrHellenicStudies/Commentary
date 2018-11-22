import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipMenuItemButton from '../../AddTooltipMenuItemButton';

// lib
import addNewBlock from '../../../../../lib/addNewBlock';

// icons
import { MdRemove } from "react-icons/md";


class AddDividerButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleAddDivider() {

	}

	handleFileInput(e) {
		const { editorState, setEditorState, setAddTooltip, addTooltip } = this.props;
		const fileList = e.target.files;
		const file = fileList[0];

		const options = {
			url: URL.createObjectURL(file),
			file,
		};

		const newEditorState = addNewBlock(editorState, 'image', options);
		setEditorState(newEditorState);
		setAddTooltip({
			...addTooltip,
			visible: false,
			menuVisible: false,
		});
	}


	render() {
		return (
			<AddTooltipMenuItemButton
				className="AddTooltipMenuItemButtonDisabled"
				title="Coming soon"
				disabled
				onClick={this.handleAddDivider}
			>
				<MdRemove />
				<span>Separator</span>
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
	setAddTooltip: (addTooltip) => {
		dispatch(editorActions.setAddTooltip(addTooltip));
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddDividerButton);
