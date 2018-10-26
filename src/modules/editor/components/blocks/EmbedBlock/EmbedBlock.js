import React from 'react'
import axios from "axios"
import { connect } from 'react-redux';

// redux
import editorActions from '../../../actions';

// lib
import updateDataOfBlock from '../../../lib/updateDataOfBlock';


class EmbedBlock extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			embedData: this.defaultData(),
			error: ""
		}
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
		return this.props.blockProps.data.toJS();
	}

	async componentDidMount() {
		if (!this.props.blockProps.data) {
			return false;
		}

		// ensure data isnt already loaded
		if (!this.dataForUpdate().endpoint && !this.dataForUpdate().inputUrl) {
			return false;
		}

		// if data isn't already loaded, get from embed.ly
		const response = await axios({
			method: 'get',
			url: `//api.embed.ly/1/extract?key=${process.env.REACT_APP_EMBEDLY_API_KEY}&url=${ this.dataForUpdate().inputUrl }`,
		});

		this.setState({ embedData: response.data });
	}

	getImageUrl() {
		if (this.state.embedData.images && this.state.embedData.images.length > 0) {
			return this.state.embedData.images[0].url;
		}

		if(this.state.embedData.thumbnailUrl ){
			return this.state.embedData.thumbnailUrl;
		}

		return null;
	}

	render() {
		return (
			<span className="embedBlock">
				{this.getImageUrl() ?
					<a
						target='_blank'
						rel="noopener noreferrer"
						className="embedImage"
						href={this.state.embedData.url}
					>
						<div
							style={{ backgroundImage: `url('${ this.getImageUrl() }')`}}
						/>
					</a>
					: ''}
				<a
					className="embedText"
					target='_blank'
					rel="noopener noreferrer"
					href={this.state.embedData.url}
				>
					<strong className="embedTitle">
						{this.state.embedData.title}
					</strong>
					<em className="embedDescription">
						{this.state.embedData.description}
					</em>
				</a>
				<span>
					{this.state.embedData.providerUrl}
				</span>
			</span>
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
)(EmbedBlock);
