import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipMenuItemButton from '../../AddTooltipMenuItemButton';

// icons
import { FaVimeo } from "react-icons/fa";

class AddVimeoButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleAddVimeo() {

	}

	render() {
		return (
			<AddTooltipMenuItemButton
				className="AddTooltipMenuItemButtonDisabled"
				onClick={this.handleAddVimeo}
			>
				<FaVimeo />
				<span>Vimeo</span>
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
)(AddVimeoButton);
