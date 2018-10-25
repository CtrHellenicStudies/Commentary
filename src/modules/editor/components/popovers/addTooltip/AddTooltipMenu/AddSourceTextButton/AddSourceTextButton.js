import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../../actions';

// components
import AddTooltipButton from '../../AddTooltipButton';


class AddSourceTextButton extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleAddSourceText() {

	}

	render() {
		return (
			<AddTooltipButton
				onClick={this.handleAddSourceText}
			>
				<i className="mdi mdi-alpha" />
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
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(AddSourceTextButton);
