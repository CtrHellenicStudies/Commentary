import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipMenuItemButton from '../../AddTooltipMenuItemButton';


class AddSourceTextButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleAddSourceText() {

	}

	render() {
		return (
			<AddTooltipMenuItemButton
				onClick={this.handleAddSourceText}
			>

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
)(AddSourceTextButton);
