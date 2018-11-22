import React from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';
import hasSelectedText from '../../../../lib/hasSelectedText';

// components
import AddTooltipMenu from '../AddTooltipMenu';
import AddTooltipButton from '../AddTooltipButton';

// icons
import { MdAdd } from "react-icons/md";

import './AddTooltip.css';

class AddTooltip extends React.Component {
	constructor(props) {
		super(props);

		this.listeningForClicks = false;
		this.addTooltipRef = React.createRef();

		autoBind(this);
	}

	toggleAddTooltipMenu(evt) {
		const { addTooltip } = this.props;

		evt.preventDefault();
		evt.stopPropagation();

		this.props.setAddTooltip({
			...addTooltip,
			menuVisible: !addTooltip.menuVisible,
		});
	}

	componentDidUpdate(_prevProps) {
		const { editorState, addTooltip, setAddTooltip } = this.props;

		if (hasSelectedText(editorState) &&
        !addTooltip.menuVisible &&
        editorState.getSelection().getHasFocus()) {
			this.listeningForClicks = true;
			document.addEventListener('click', this.collapseAddTooltipMenu);

			setAddTooltip({
				...addTooltip,
				menuVisible: true,
			});
		}
	}

	// TODO: (charles) Also hide on `ESC` keypress.
	collapseAddTooltipMenu(evt) {
		if (this.addTooltipRef.current.contains(evt.target)) return;

		const { setAddTooltip, addTooltip } = this.props;

		if (addTooltip.menuVisible) {
			this.listeningForClicks = false;
			document.removeEventListener('click', this.collapseAddTooltipMenu);

			setAddTooltip({
				...addTooltip,
				menuVisible: false,
			});
		}
	}

	render(){
		const { addTooltip } = this.props;

		return (
			<div
				ref={this.addTooltipRef}
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
					<MdAdd />
				</AddTooltipButton>
				<AddTooltipMenu />
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
