import React from 'react'
import S3Upload from 'react-s3-uploader/s3upload';
import shortid from 'shortid';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';

import {
	// EditorBlock,
	EditorState,
} from 'draft-js';


// redux
import editorActions from '../../../actions';

// components
import ImageBlockLoader from '../ImageBlockLoader';

// lib
import updateDataOfBlock from '../../../lib/updateDataOfBlock';

import './ImageBlock.css';


class ImageBlock extends React.Component {

	constructor(props) {
		super(props);
		const file = this.props.blockProps.data.get('file');
		const url = this.props.blockProps.data.get('url');

		this.state = {
			loading: false,
			selected: false,
			loadingProgress: 0,
			width: 0,
			height: 0,
			aspectRatio: {
				width: 0,
				height: 0,
				ratio: 100,
			},
			file,
			url,
		};

		autoBind(this);
	}

	componentDidMount() {
		this.img = new Image();
		this.img.src = this.refs.imageElem.src;


		// Do not attempt to upload image if already uploaded
		if (
			this.img
			&& !this.img.src.includes("blob:")
		) {
			return false;
		}

		this.img.onload = () => {
			console.log(this.img);
			console.log(this.img);
			console.log(this.img.width);
			console.log(this.img.height);

			this.setState({
				width: this.img.width,
				height: this.img.height,
				aspectRatio: this.getAspectRatio(this.img.width, this.img.height)
			});

			// this.handleUpload();
		}
	}

	getAspectRatio(w, h) {
		let maxWidth = 1000;
		let maxHeight = 1000;
		let ratio = 0;
		let width = w; // Current image width
		let height = h; // Current image height

		// Check if the current width is larger than the max
		if (width > maxWidth) {
			ratio = maxWidth / width; // get ratio for scaling image
			height = height * ratio; // Reset height to match scaled image
			width = width * ratio; // Reset width to match scaled image

			// Check if current height is larger than max
		} else if (height > maxHeight) {
			ratio = maxHeight / height; // get ratio for scaling image
			width = width * ratio; // Reset width to match scaled image
			height = height * ratio; // Reset height to match scaled image

		}

		const fillRatio = height / width * 100;
		const result = { width, height, ratio: fillRatio };
		return result;
	}

	updateData() {
		let { block, editorState, setEditorState } = this.props;

		let data = block.getData();
		let newData = data.merge(this.state).merge();

		setEditorState(updateDataOfBlock(editorState, block, newData));
	}

	startLoader() {
		return this.setState({
			loading: true,
		});
	}

	stopLoader() {
		return this.setState({
			loading: false,
		});
	}

	handleUpload() {
		this.startLoader();
		this.updateData();
		this.uploadFile();
	}

	aspectRatio() {
		return {
			maxWidth: `${ this.state.aspectRatio.width }`,
			maxHeight: `${ this.state.aspectRatio.height }`,
			ratio: `${ this.state.aspectRatio.height }`
		};
	}

	updateDataSelection() {
		const { getEditorState } = this.props.blockProps;
		const { setEditorState } = this.props;
		const newSelection = getEditorState().getSelection().merge({
			anchorKey: this.props.block.getKey(),
			focusKey: this.props.block.getKey()
		});

		return setEditorState(EditorState.forceSelection(getEditorState(), newSelection));
	}

	handleFocusImage(e) {
		// show image manipulation tooltip
	}

	handleFocusCaption(e) {
		// focus on caption input
	}

	coords() {
		return {
			maxWidth: `${ this.state.aspectRatio.width }px`,
			maxHeight: `${ this.state.aspectRatio.height }px`
		};
	}

	uploadFile() {
		const acceptedFile = this.state.file;
		const fileToUpload = {
			files: [acceptedFile]
		};

		if (fileToUpload) {
			new S3Upload({
				onFinishS3Put: this.uploadCompleted,
				onProgress: this.updateProgressBar,
				fileElement: fileToUpload,
				signingUrl: '/s3/sign',
				s3path: 'images/',
				server: process.env.REACT_APP_SERVER,
				onError: this.handleError,
				uploadRequestHeaders: { 'x-amz-acl': 'public-read' },
				contentDisposition: 'auto',
				scrubFilename: (filename) => {
					const secureFilename = filename.replace(/[^\w\d_\-\.]+/ig, ''); // eslint-disable-line
					return `${shortid.generate()}_${secureFilename}`;
				},
				signingUrlMethod: 'GET',
				signingUrlWithCredentials: true,
			});
		}
	}

	handleError(e) {
		console.error('Image upload failed:', e);
	}

	uploadCompleted(e) {
		const image = {
			name: e.filename,
			path: `${process.env.REACT_APP_BUCKET_URL}/${e.filename}`,
			thumbPath: `https://iiif.orphe.us/${e.filename}/full/400,/0/default.jpg`,
		};

		this.setState({ url: image.path }, this.updateData);
		this.stopLoader();
	}

	updateProgressBar(e) {
 		let { loadingProgress } = this.state;

		this.setState({
			loadingProgress,
		});
	}

	render() {

		return (
			<div className="imageWithCaption">
				<div
					className="aspectRatioPlaceholder is-locked"
					style={this.coords()}
				>
					<div
						// style={{ paddingBottom: `${ this.state.aspectRatio.ratio }%` }}
						className='aspectRatioFill'
					/>
					<img
						src={this.state.url}
						ref="imageElem"
						height={this.state.aspectRatio.height}
						width={this.state.aspectRatio.width}
						alt={this.state.alt}
						onClick={this.handleFocusImage}
					/>
					<ImageBlockLoader
						toggle={this.state.loading}
						progress={this.state.loadingProgress}
					/>
				</div>
				{/*
				<figcaption
					className='imageCaption'
					onMouseDown={this.handleFocusCaption}
				>
					{ this.props.block.getText().length === 0 ?
						<span className="defaultPlaceholder">
							{this.props.placeholderText}
						</span>
					:
						''
					}
					<EditorBlock
						{...Object.assign(
							{},
							this.props,
							{
								"editable": true,
								"className": "imageCaption",
							},
						)}
					/>
				</figcaption>
				*/}
			</div>
		)
	}
}

ImageBlock.defaultProps = {
	placeholderText: 'Caption . . .',
};

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
)(ImageBlock);
