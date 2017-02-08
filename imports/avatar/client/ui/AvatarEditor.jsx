import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { sendSnack } from '/imports/ui/components/SnackAttack.jsx';
import { AvatarUploader } from '/imports/avatar/client/avatar_client_utils.js';
import autoBind from 'react-autobind';
import { Slingshot } from 'meteor/edgee:slingshot';

export default class AvatarEditor extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			avatarUrl: Meteor.user() && Meteor.user().profile && Meteor.user().profile.avatarUrl ? Meteor.user().profile.avatarUrl : props.defaultAvatarUrl,
		};

		//binding users
		autoBind(this);
	}

	preventDefault(event) {
		event.preventDefault();
	}

	uploadAvatar(event) {
	    let context = {type: 'user'};

	    let uploader = new Slingshot.Upload("uploads", context);

	    uploader.send(event.target.files[0], (error, downloadUrl) => {
	      if (error) {
	        // Log service detailed response
	        console.error('Error uploading', uploader.xhr.response);
	        sendSnack(error);
	      } else {
	        Meteor.users.update({_id: Meteor.userId()}, {
	          $set: {
	            "profile.avatarUrl": downloadUrl
	          }
	        });

	        this.setState({ avatarUrl: downloadUrl });

       	  sendSnack('Profile pic has been uploaded');

	      }
	    });
	}

	handleSelectFile(event) {
		this.upload.click();
	}

	render() {
		return (
			<div className="user-profile-picture-container">
				<div className="user-profile-picture">
					<input id="avatar" type="file" ref={(ref) => this.upload = ref} onChange={this.uploadAvatar} style={{ display: 'none' }} />
					<img alt="avatar" src={this.state.avatarUrl} />

					<div
						className="upload-profile-picture"
						onClick={this.handleSelectFile}
					>
						<i className="mdi mdi-image-area" />
						<span className="help-text">
							Select to upload.
						</span>
					</div>
				</div>
			</div>
		);
	}
}

AvatarEditor.propTypes = {
	defaultAvatarUrl: React.PropTypes.string.isRequired
};

AvatarEditor.defaultProps = {
	defaultAvatarUrl: '',
};
