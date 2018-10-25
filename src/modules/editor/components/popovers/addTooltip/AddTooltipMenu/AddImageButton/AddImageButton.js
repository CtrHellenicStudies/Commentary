import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipButton from '../../AddTooltipButton';

// lib
import addNewBlock from '../../../../../lib/addNewBlock';


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
			<AddTooltipButton
				onClick={this.handleAddImage}
			>
				<i className="mdi mdi-image" />
				<input
					type="file"
					style={{ display: 'none' }}
					ref="fileInput"
					onChange={this.handleFileInput}
				/>
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
)(AddImageButton);
