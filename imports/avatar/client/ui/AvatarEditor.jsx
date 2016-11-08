import React from "react";
import {Meteor} from "meteor/meteor";
import LinearProgress from "material-ui/LinearProgress";
import {createContainer} from "meteor/react-meteor-data";
import {sendSnack} from "/imports/ui/components/SnackAttack.jsx";
import {AvatarUploader} from "/imports/avatar/client/avatar_client_utils.js";

class AvatarEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			avatarUrl: props.defaultAvatarUrl,
			isDefault: true,
			progress: 0,
			isProgressShown: false,
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
			avatarUrl: isDefault ? nextProps.defaultAvatarUrl : nextProps.avatar.url,
		});
	}

	preventDefault(event) {
		event.preventDefault();
	}

	uploadAvatar(data, context) {
		const uploader = new AvatarUploader({
			data, context,
			onStart: (avatar) => {
				this.setState({
					progress: 0,
					isProgressShown: true,
				});
			},
			onError(err) {
				console.error(err);
				sendSnack(err.reason);
			},
			onComplete: (avatar) => {
				this.setState({
					isProgressShown: false,
				});
				sendSnack('Profile pic has been uploaded');
			},
			onProgress: (avatar, progress) => {
				if (progress > 100) {
					this.setState({progress: 100});
				} else {
					this.setState({progress: Math.floor(progress * 100)});
				}
			},
		});

		uploader.start();
	}

	handleDrop(event) {
		event.preventDefault();
		this.uploadAvatar(event.dataTransfer.files[0], {type: 'user'});
	}

	handleSelectFile() {
		UploadFS.selectFile(data => this.uploadAvatar(data, {type: 'user'}));
	}

	handleDeleteAvatar() {
		if (!this.state.isDefault && this.props.avatar._id) {
			Meteor.call('avatar.delete', {avatarId: this.props.avatar._id});
		}
	}

	render() {
		let progressStyle = {
			display: 'none',
		};
		if (this.state.isProgressShown) {
			progressStyle = {
				display: 'block',
			};
		}
		return (
			<div className="user-profile-picture-container">
				<div className="userAvatarDelete" onClick={this.handleDeleteAvatar}>
					<i
						className={`mdi mdi-delete mdi-36px mdi-dark ${(this.state.isDefault ?
							'mdi-inactive userAvatarDeleteInactive' : 'userAvatarDeleteActive')}`}
					/>
				</div>
				<div className="user-profile-picture">
					<img alt="avatar" src={this.state.avatarUrl}/>

					<div
						className="upload-profile-picture"
						onClick={this.handleSelectFile}
						onDragStart={this.preventDefault}
						onDragEnter={this.preventDefault}
						onDragOver={this.preventDefault}
						onDragLeave={this.preventDefault}
						onDrop={this.handleDrop}
					>
						<i className="mdi mdi-image-area"/>
						<span className="help-text">
							Select to upload or drag and drop.
						</span>
					</div>
				</div>
				<LinearProgress mode="determinate" value={this.state.progress} style={progressStyle}/>
			</div>
		);
	}
}

AvatarEditor.propTypes = {
	defaultAvatarUrl: React.PropTypes.string.isRequired,
	avatar: React.PropTypes.object,
	avatarLoading: React.PropTypes.bool,
	user: React.PropTypes.object,
};

AvatarEditor.defaultProps = {
	defaultAvatarUrl: '',
	avatar: {},
	avatarLoading: false,
};

export default createContainer((props) => {
	const myAvatarHandle = Meteor.subscribe('users.myAvatar');
	let userAvatar = '';
	if (props.user) {
		userAvatar = props.user.avatar || {};
	} else {
		userAvatar = Meteor.user().avatar || {};
	}
	;

	return {
		defaultAvatarUrl: props.defaultAvatarUrl,
		avatar: userAvatar,
		avatarLoading: !myAvatarHandle.ready(),
	};
}, AvatarEditor);
