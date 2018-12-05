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
import { MdImage } from "react-icons/md";


class AddImageButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleAddImage() {
		this.refs.fileInput.click()
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
				onClick={this.handleAddImage}
			>
				<MdImage />
				<span>Image</span>
				<input
					type="file"
					style={{ display: 'none' }}
					ref="fileInput"
					onChange={this.handleFileInput}
				/>
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
)(AddImageButton);
