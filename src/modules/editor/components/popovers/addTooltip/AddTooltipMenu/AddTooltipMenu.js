import React from 'react'
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

// redux
import editorActions from '../../../../actions';

// components
import AddImageButton from './AddImageButton';
import AddDividerButton from './AddDividerButton';
import AddItemButton from './AddItemButton';
// import AddSourceTextButton from './AddSourceTextButton';
import AddYoutubeButton from './AddYoutubeButton';
import AddVimeoButton from './AddVimeoButton';
import AddSketchfabButton from './AddSketchfabButton';

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
				<div className="addTooltipMenuSection">
					<h6 className="addTooltipMenuSectionHeader">Primary</h6>
					<div className="addTooltipMenuSectionItems">
						<AddImageButton />
						<AddDividerButton />
						<AddItemButton />
						{/*<AddSourceTextButton />*/}
					</div>
				</div>
				<div className="addTooltipMenuSection">
					<h6 className="addTooltipMenuSectionHeader">Embed</h6>
					<div className="addTooltipMenuSectionItems">
						<AddYoutubeButton />
						<AddVimeoButton />
						<AddSketchfabButton />
					</div>
				</div>
				<div className="addTooltipMenuFooter">
					More options coming soon.
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
)(AddTooltipMenu);
