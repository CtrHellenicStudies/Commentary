import React from 'react';
import { sendSnack } from '/imports/ui/components/shared/SnackAttack';
import autoBind from 'react-autobind';
import { Slingshot } from 'meteor/edgee:slingshot';
import DropZone from 'react-dropzone';

export default class AvatarEditor extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			avatarUrl: Meteor.user() && Meteor.user().profile && Meteor.user().profile.avatarUrl ? Meteor.user().profile.avatarUrl : props.defaultAvatarUrl,
		};

		// binding users
		autoBind(this);
	}

	preventDefault(event) {
		event.preventDefault();
	}

	onDrop(acceptedFiles, rejectedFiles) {
		const context = { type: 'user' };
		const uploader = new Slingshot.Upload('uploads', context);

		if (rejectedFiles && rejectedFiles.length) {
			sendSnack('There was an error uploading your profile picture');
		}

		uploader.send(acceptedFiles[0], (error, downloadUrl) => {
			if (error) {
				// Log service detailed response
				console.error('Error uploading', uploader.xhr.response);
				sendSnack(error);
			} else {
				Meteor.users.update({_id: Meteor.userId()}, {
					$set: {
						'profile.avatarUrl': downloadUrl
					}
				});

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
	defaultAvatarUrl: React.PropTypes.string.isRequired
};

AvatarEditor.defaultProps = {
	defaultAvatarUrl: '',
};
