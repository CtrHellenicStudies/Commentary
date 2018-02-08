import React, {Component} from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import DropZone from 'react-dropzone';
import Cookies from 'js-cookie';
import { sendSnack } from '../../../shared/SnackAttack';

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
        const uploader = {};

		if (rejectedFiles && rejectedFiles.length) {
			sendSnack('There was an error uploading your profile picture');
		}

		uploader.send(acceptedFiles[0], (error, downloadUrl) => {
			if (error) {
				// Log service detailed response
				console.error('Error uploading', uploader.xhr.response);
				sendSnack(error);
			} else {
				// Meteor.users.update({_id: Meteor.userId()}, {
				// 	$set: {
				// 		'profile.avatarUrl': downloadUrl
				// 	}
				// }); TODO

				this.setState({ avatarUrl: downloadUrl });

				sendSnack('Profile picture has been uploaded');
			}
		});
	}

	render() {
		return (
			<DropZone className="dropzone" onDrop={this.onDrop} multiple={false} accept={'image/*'}>
				<div className="user-profile-picture-container">
					<div className="user-profile-picture">
						<img alt="avatar" src={this.state.avatarUrl} />

						<div
							className="upload-profile-picture"
							onClick={this.handleSelectFile}
						>
							<i className="mdi mdi-image-area" />
							<span className="help-text">
								Select to upload or drag and drop image.
							</span>
						</div>
					</div>
				</div>
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
