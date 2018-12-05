import React from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';
import DropZone from 'react-dropzone';
import Cookies from 'js-cookie';

export default class AvatarEditor extends React.Component {
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
			console.error('There was an error uploading your profile picture');
		}

		uploader.send(acceptedFiles[0], (error, avatarUrl) => {
			if (error) {
				// Log service detailed response
				console.error('Error uploading', uploader.xhr.response);
			} else {
				this.setState({ avatarUrl });
				console.error('Profile picture has been uploaded');
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
