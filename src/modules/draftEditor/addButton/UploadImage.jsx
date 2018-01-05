import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import DropZone from 'react-dropzone';
import Cookies from 'js-cookie';
import RaisedButton from 'material-ui/RaisedButton';

import { sendSnack } from '../../shared/SnackAttack';

export default class AvatarEditor extends React.Component {
	constructor(props) {
		super(props);
        const user = Cookies.getItem('user');
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
		const uploader = {}; // TODO = new Slingshot.Upload('uploads', context);

		if (rejectedFiles && rejectedFiles.length) {
			sendSnack('There was an error uploading your profile picture');
		}

		uploader.send(acceptedFiles[0], (error, downloadUrl) => {
			if (error) {
				// Log service detailed response
				console.error('Error uploading', uploader.xhr.response);
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
