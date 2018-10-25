import React from 'react'
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';

// components
import AddImageButton from './AddImageButton';
// import AddItemButton from './AddItemButton';
// import AddSourceTextButton from './AddSourceTextButton';


import './AddTooltipMenu.css';


class AddTooltipMenu extends React.Component {

	constructor(props) {
		super(props)
		autoBind(this);
	}

	render() {
		const { addTooltip } = this.props;

		return (
			<div
				 className={`
					 addTooltipMenu
					 ${addTooltip.menuVisible ? 'addTooltipMenuVisible' : ''}
				 `}
			 >
				 <AddImageButton />
				 {/*
				 <AddItemButton />
				 <AddSourceTextButton />
				 */}
			</div>
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
)(AddTooltipMenu);
