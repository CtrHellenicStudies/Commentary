import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
// import S3Upload from 'react-s3-uploader/s3upload';

import DropZone from 'react-dropzone';
import Cookies from 'js-cookie';
import RaisedButton from 'material-ui/RaisedButton';


export default class AvatarEditor extends Component {
	constructor(props) {
		super(props);
		const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : undefined;
		this.state = {
			avatarUrl: user && user.profile && user.profile.avatarUrl ? user.profile.avatarUrl : props.defaultAvatarUrl,
		};

		// binding users
		autoBind(this);
	}

	preventDefault(event) {
		event.preventDefault();
	}

	onDrop(acceptedFiles, rejectedFiles) {
		// const context = { type: 'user' };

		if (rejectedFiles && rejectedFiles.length) {
			console.err('Error uploading file');
		}

		// TODO: implement S3 Upload for uploading file
		/**
		uploadFile(acceptedFile) {
			const fileToUpload = {
				files: [acceptedFile[0]]
			};
			if (fileToUpload.files.length) {
				this.setState({uploading: true});

				const uploader = new S3Upload({
					onFinishS3Put: this.handleFinish,
					onProgress: this.handleProgress,
					fileElement: fileToUpload,
					signingUrl: '/s3/sign',
					s3path: 'images/',
					server: process.env.REACT_APP_SERVER,
					onError: this.handleError,
					uploadRequestHeaders: { 'x-amz-acl': 'public-read' },
					contentDisposition: 'auto',
					scrubFilename: (filename) => {
	          const secureFilename = filename.replace(/[^\w\d_\-\.]+/ig, ''); // eslint-disable-line
						return `${makeId()}-${secureFilename}`;
					},
					signingUrlMethod: 'GET',
					signingUrlWithCredentials: true,
				});

				// TODO: fix uploader
				uploader.upload();
			}
		}
		*/
	}

	render() {
		return (
			<DropZone className="draft-editor-dropzone" onDrop={this.onDrop} multiple={false} accept={'image/*'}>
				<RaisedButton className="draft-add-video-confirm-button" onClick={this.addVideo}>Upload image</RaisedButton>
			</DropZone>
		);
	}
}

AvatarEditor.propTypes = {
	defaultAvatarUrl: PropTypes.string.isRequired
};

AvatarEditor.defaultProps = {
	defaultAvatarUrl: '',
};
