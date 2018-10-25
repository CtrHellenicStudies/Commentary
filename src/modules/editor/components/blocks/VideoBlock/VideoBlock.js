import React from 'react'
import axios from "axios"
import { connect } from 'react-redux';
// import { EditorBlock } from 'draft-js'

// redux
import editorActions from '../../../actions';

// lib
import updateDataOfBlock from '../../../lib/updateDataOfBlock';


class VideoBlock extends React.Component {
	constructor(props) {
		super(props)
		this.state = { embedData: this.defaultData() };
	}

	defaultData() {
		const existingData = this.props.block.getData().toJS()
		return existingData.embedData || {}
	}

	updateData() {
		const { block, editorState, setEditorState } = this.props;
		const data = block.getData();
		const newData = data.merge(this.state);
		setEditorState(updateDataOfBlock(editorState, block, newData));
	}

	dataForUpdate() {
		return this.props.blockProps.data.toJS()
	}

	async componentDidMount() {

		if (!this.props.blockProps.data) {
			return
		}
		// ensure data isnt already loaded
		if (!this.dataForUpdate().endpoint && !this.dataForUpdate().inputUrl) {
			return
		}

		const response = await axios({
			method: 'get',
			url: `//api.embed.ly/1/extract?key=${process.env.REACT_APP_EMBEDLY_API_KEY}&url=${ this.dataForUpdate().inputUrl }`,
		});

		this.setState({ embedData: response.data });
	}

	renderEmbedHtml() {
		if (this.dataForUpdate().mediaRenderHandler){
			return this.dataForUpdate().mediaRenderHandler()
		}else{
			return this.state.embedData.media ? this.state.embedData.media.html : this.state.embedData.html
		}
	}

	render() {
		return (
			<figure className="videoBlock">
				<div className='iframeContainer'
					dangerouslySetInnerHTML={ { __html: this.renderEmbedHtml() } }
				/>
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
)(VideoBlock);
