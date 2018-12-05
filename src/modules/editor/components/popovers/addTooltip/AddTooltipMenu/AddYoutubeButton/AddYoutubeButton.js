import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipMenuItemButton from '../../AddTooltipMenuItemButton';

// icons
import { FaYoutube } from "react-icons/fa";

class AddYoutubeButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleAddYoutube() {

	}

	render() {
		return (
			<AddTooltipMenuItemButton
				className="AddTooltipMenuItemButtonDisabled"
				onClick={this.handleAddYoutube}
			>
				<FaYoutube />
				<span>YouTube</span>
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
)(AddYoutubeButton);
