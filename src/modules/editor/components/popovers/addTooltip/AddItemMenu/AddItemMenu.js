import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';

// components
import ItemListContainer from '../../../../../items/containers/ItemListContainer';

import './AddItemMenu.css';


class AddItemMenu extends React.Component {

	constructor(props) {
		super(props);
		autoBind(this);
	}

	handleToggleAddItemMenu() {
		const { addTooltip, setAddTooltip, } = this.props;
		setAddTooltip({ ...addTooltip, itemMenuVisible: false });
	}

	render() {
		return (
			<div className="addItemMenu">
				<div className="addItemMenuPanel">
					<input
						type="text"
						className="itemListSearch"
						placeholder="Search items . . ."
					/>
					<ItemListContainer />
					<button
						className="closeItemMenu"
						onClick={this.handleToggleAddItemMenu}
					>
						<i className="mdi mdi-close" />
					</button>
				</div>
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
)(AddItemMenu);
