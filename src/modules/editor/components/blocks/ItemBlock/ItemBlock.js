import React from 'react'
import { connect } from 'react-redux';
// import { EditorBlock } from 'draft-js'

// redux
import editorActions from '../../../actions';

import ItemEmbedContainer from '../../../../items/containers/ItemEmbedContainer';


class ItemBlock extends React.Component {
	constructor(props) {
		super(props)
		this.state = { embedData: this.defaultData() };
	}

	defaultData() {
		const existingData = this.props.block.getData().toJS()
		return existingData.embedData || {}
	}

	render() {
		return (
			<figure className="itemBlock">
				<ItemEmbedContainer />
			</figure>
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
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(ItemBlock);
