import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';

// components
import AddTooltipMenu from '../AddTooltipMenu';
import AddItemMenu from '../AddItemMenu';
import AddTooltipButton from '../AddTooltipButton';


import './AddTooltip.css';



class AddTooltip extends React.Component {

	constructor(props) {
		super(props)
		autoBind(this);
	}

	async toggleAddTooltipMenu() {
		const { addTooltip } = this.props;
		await this.props.setAddTooltip({
			...addTooltip,
			menuVisible: !addTooltip.menuVisible,
		});
	}

	render(){
		const { addTooltip } = this.props;

		return (
			<div
				className={ `
					addTooltip
					${addTooltip.visible ? 'addTooltipVisible' : ''}
					${addTooltip.menuVisible ? 'addTooltipMenuVisible' : ''}
				`}
				style={this.props.addTooltip.position}
			>
				<AddTooltipButton
					onClick={this.toggleAddTooltipMenu}
					type="button"
					className="addTooltipToggle"
				>
					<i className="mdi mdi-plus" />
				</AddTooltipButton>

				<AddTooltipMenu />

				{addTooltip.itemMenuVisible ?
					<AddItemMenu />
					: ''}
			</div>
		)
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
)(AddTooltip);
