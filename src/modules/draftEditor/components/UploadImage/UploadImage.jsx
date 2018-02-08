import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import DropZone from 'react-dropzone';
import Cookies from 'js-cookie';
import RaisedButton from 'material-ui/RaisedButton';

import { uploadFile } from '../../../../lib/s3';
import { sendSnack } from '../../../shared/components/SnackAttack/SnackAttack';


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
			sendSnack('There was an error uploading your profile picture');
		}

		uploadFile(acceptedFiles[0], (error, downloadUrl) => {
			if (error) {
				// Log service detailed response
				console.error(error);
				sendSnack(error);
			} else {
				this.props.uploadedUrl(downloadUrl);
			}
		});
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
