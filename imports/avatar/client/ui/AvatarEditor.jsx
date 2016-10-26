import React from 'react';
import { Meteor } from 'meteor/meteor';
import LinearProgress from 'material-ui/LinearProgress';
import { createContainer } from 'meteor/react-meteor-data';
import { sendSnack } from '/imports/ui/components/SnackAttack.jsx';

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
		const file = {
			name: data.name,
			size: data.size,
			type: data.type,
			contextType: context.type,
		};

		if (context.type === 'commenter') {
			check(context.commenterId, String);
			file.commenterId = context.commenterId;
		} else if (context.type !== 'user') {
			throw new Error(`invalid context type ${context.type}`);
		}
		const self = this;
		const uploader = new UploadFS.Uploader({
			store: 'avatars',
			adaptive: true,
			capacity: 0.8, // 80%
			chunkSize: 8 * 1024, // 8k
			maxChunkSize: 128 * 1024, // 128k
			maxTries: 3,
			data,
			file,

			onCreate(avatar) {
				console.log(avatar.name, ' has been created');
			},
			onStart(avatar) {
				console.log(avatar.name, ' started');
				self.setState({
					isProgressShown: true,
				});
			},
			onError(err) {
				console.error(err);
				sendSnack(err.reason);
			},
			onAbort(avatar) {
				console.log(avatar.name, ' upload has been aborted');
			},
			onComplete(avatar) {
				console.log(avatar.name, ' has been uploaded');
				self.setState({
					isProgressShown: false,
				});
				sendSnack('Profile pic has been uploaded');
			},
			onProgress(avatar, progress) {
				console.log(avatar.name, ' ', (progress * 100), '% uploaded');
				if (progress > 100) {
					self.setState({ progress: 100 });
				} else {
					self.setState({ progress: Math.floor(progress * 100) });
				}
			},
			onStop(avatar) {
				console.log(avatar.name, ' stopped');
			},
		});

		uploader.start();
	}

	handleDrop(event) {
		event.preventDefault();
		this.uploadAvatar(event.dataTransfer.files[0], { type: 'user' });
	}

	handleSelectFile() {
		UploadFS.selectFile(data => this.uploadAvatar(data, { type: 'user' }));
	}

	handleDeleteAvatar() {
		if (!this.state.isDefault && this.props.avatar._id) {
			Meteor.call('avatar.delete', { avatarId: this.props.avatar._id });
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
				<div className="userAvatarDelete" onClick={this.handleDeleteAvatar} >
					<i
						className={`mdi mdi-delete mdi-36px mdi-dark ${(this.state.isDefault ?
							'mdi-inactive userAvatarDeleteInactive'	: 'userAvatarDeleteActive')}`}
					/>
				</div>
				<div className="user-profile-picture">
					<img alt="avatar" src={this.state.avatarUrl} />

					<div
						className="upload-profile-picture"
						onClick={this.handleSelectFile}
						onDragStart={this.preventDefault}
						onDragEnter={this.preventDefault}
						onDragOver={this.preventDefault}
						onDragLeave={this.preventDefault}
						onDrop={this.handleDrop}
					>
						<i className="mdi mdi-image-area" />
						<span className="help-text">
							Select to upload or drag and drop.
						</span>
					</div>
				</div>
				<LinearProgress mode="determinate" value={this.state.progress} style={progressStyle} />
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
