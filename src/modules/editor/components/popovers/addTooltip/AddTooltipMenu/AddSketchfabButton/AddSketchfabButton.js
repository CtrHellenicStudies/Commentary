import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipMenuItemButton from '../../AddTooltipMenuItemButton';

class AddSketchfabButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleAddSketchfab() {

	}

	render() {
		return (
			<AddTooltipMenuItemButton
				className="AddTooltipMenuItemButtonDisabled"
				onClick={this.handleAddSketchfab}
			>
				<img src="./img/ic_sketchfab.svg" alt="" />
				<span>Sketchfab</span>
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
)(AddSketchfabButton);
