import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import {
	Editor,
	EditorState,
	SelectionState,
} from 'draft-js';

// redux
import editorActions from '../../actions';

// components
import FormattingTooltip from '../popovers/formattingTooltip/FormattingTooltip';
import AddTooltip from '../popovers/addTooltip/AddTooltip';
import ImageBlock from '../blocks/ImageBlock';
import VideoBlock from '../blocks/VideoBlock';
import EmbedBlock from '../blocks/EmbedBlock';

// lib
import { handleAddTooltip } from '../../lib/handleTooltips';


import './Editor.css';


class OrpheusEditor extends React.Component {

	constructor(props) {
		super(props);

		// this.editorRef = React.createRef();

		autoBind(this);
	}

	componentDidMount() {
		// this.props.setEditorRef(this.editorRef);
	}

	onBlur(_evt) {
		const { editorState, setEditorState } = this.props;

		setEditorState(EditorState.acceptSelection(editorState, SelectionState.createEmpty()));
	}

	onChange(newEditorState) {
		const { setEditorState } = this.props;

		setEditorState(newEditorState);
		// Wait a tick so that the changes propagate
		setTimeout(() => handleAddTooltip(this.props));
	}

	handleBlockRenderer(block) {
		switch (block.getType()) {

		case "image":
			return {
				component: ImageBlock,
				editable: true,
				props: {
					data: block.getData(),
				},
			};

		case "video":
			return {
				component: VideoBlock,
				editable: false,
				props: {
					data: block.getData(),
				},
			};

		case "embed":
			return {
				component: EmbedBlock,
				editable: false,
				props: {
					data: block.getData(),
				},
			};

		default:
			break;
		}
	}

	render() {

		return (
			<div
				className="chsEditor"
			>
				<Editor
					editorState={this.props.editorState}
					onChange={this.onChange}
					placeholder={this.props.placeholder}
					readOnly={this.props.readOnly}
					blockRendererFn={this.handleBlockRenderer}
				/>
				<FormattingTooltip />
				<AddTooltip />
			</div>
		);
	}
}

OrpheusEditor.defaultProps = {
	placeholder: 'Write your text...',
	readOnly: false,
};


const mapStateToProps = state => ({
	...state.editor,
});

const mapDispatchToProps = dispatch => ({
	setEditorRef: editorRef => dispatch(editorActions.setEditorRef(editorRef)),
	setEditorState: (editorState) => {
		dispatch(editorActions.setEditorState(editorState));
	},
	setTooltip: (tooltip) => {
		dispatch(editorActions.setTooltip(tooltip));
	},
	setAddTooltip: (addTooltip) => {
		dispatch(editorActions.setAddTooltip(addTooltip));
	},
});

export default connect(
	mapStateToProps, mapDispatchToProps,
)(OrpheusEditor);
