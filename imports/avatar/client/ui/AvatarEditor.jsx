import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { uploadAvatar } from '../avatar_client_utils.js';

class AvatarEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			avatarUrl: props.defaultAvatarUrl,
			isDefault: true,
		};

		this.preventDefault = this.preventDefault.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handleSelectFile = this.handleSelectFile.bind(this);
		this.handleDeleteAvatar = this.handleDeleteAvatar.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		const isDefault = !nextProps.avatar.url;
		this.setState({
			isDefault,
			avatarUrl: isDefault? nextProps.defaultAvatarUrl : nextProps.avatar.url,
		});
	}

	preventDefault(event) {
		event.preventDefault();
	}

	handleDrop(event) {
		event.preventDefault();
		uploadAvatar(event.dataTransfer.files[0], { type:'user' });
	}

	handleSelectFile() {
		UploadFS.selectFile(data => uploadAvatar(data, { type:'user' }));
	}

	handleDeleteAvatar(event) {
		if (!this.state.isDefault && this.props.avatar._id) {
			Meteor.call('avatar.delete', { avatarId: this.props.avatar._id });
		}
	}

	render() {
		return (
			<div>
				<div className="userAvatarDelete" onClick={this.handleDeleteAvatar} >
					<i className=
						{"mdi mdi-delete mdi-36px mdi-dark " + (this.state.isDefault?
							"mdi-inactive userAvatarDeleteInactive"
							: "userAvatarDeleteActive")
						}
					/>
				</div>
				<div className="user-profile-picture">
					<img src={this.state.avatarUrl} />

					<div className="upload-profile-picture"
						onClick={this.handleSelectFile}
						onDragStart={this.preventDefault}
						onDragEnter={this.preventDefault}
						onDragOver={this.preventDefault}
						onDragLeave={this.preventDefault}
						onDrop={this.handleDrop}
					>
						<i className="mdi mdi-image-area"></i>
						<span className="help-text">
							Select to upload or drag and drop.
						</span>
					</div>
				</div>
			</div>
		);
	}
}

AvatarEditor.propTypes = {
	defaultAvatarUrl: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.object,
	avatarLoading: React.PropTypes.bool,
};

AvatarEditor.defaultProps = {
	defaultAvatarUrl: '',
	avatar: {},
	avatarLoading: false,
};

export default createContainer((props) => {
	const myAvatarHandle = Meteor.subscribe('users.myAvatar');

	return {
		defaultAvatarUrl: props.defaultAvatarUrl,
		avatar: Meteor.user().avatar,
		avatarLoading: !myAvatarHandle.ready(),
	};
}, AvatarEditor);