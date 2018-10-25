import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import {
	Editor,
} from 'draft-js';

// redux
import editorActions from '../../actions';

// components
import Tooltip from '../popovers/tooltip/Tooltip';
import AddTooltip from '../popovers/addTooltip/AddTooltip';
import ImageBlock from '../blocks/ImageBlock';
import VideoBlock from '../blocks/VideoBlock';
import EmbedBlock from '../blocks/EmbedBlock';

// lib
import handleTooltips from '../../lib/handleTooltips';


import './Editor.css';


class OrpheusEditor extends React.Component {

	constructor(props) {
		super(props)

		autoBind(this);
	}

	async onChange(newEditorState) {
		const { setEditorState } = this.props;

		await setEditorState(newEditorState);
		await handleTooltips(this.props);
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
				id="editor"
			>
				<div className="content">
					<Editor
						editorState={this.props.editorState}
						onChange={this.onChange}
						placeholder={this.props.placeholder}
						readOnly={this.props.readOnly}
						blockRendererFn={this.handleBlockRenderer}
					/>
				</div>
				<Tooltip />
				<AddTooltip />
			</div>
		);
	}
}

OrpheusEditor.defaultProps = {
	placeholder: 'Enter text . . .',
	readOnly: false,
};


const mapStateToProps = state => ({
	...state.editor,
});

const mapDispatchToProps = dispatch => ({
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
