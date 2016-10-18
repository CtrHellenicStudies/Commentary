import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

class AvatarEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			avatarUrl: props.defaultAvatarUrl,
		};

		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDragEnter = this.handleDragEnter.bind(this);
		this.handleDragOver = this.handleDragOver.bind(this);
		this.handleDragLeave = this.handleDragLeave.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handleSelectFile = this.handleSelectFile.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			avatarUrl: nextProps.avatar.url? nextProps.avatar.url : nextProps.defaultAvatarUrl,
		});
	}

	handleDragStart(event) {
		event.preventDefault();
	}

	handleDragEnter(event) {
		event.preventDefault();
	}

	handleDragOver(event) {
		event.preventDefault();
	}

	handleDragLeave(event) {
		event.preventDefault();
	}

	handleDrop(event) {
		event.preventDefault();
		this.uploadFile(event.dataTransfer.files[0]);
	}

	handleSelectFile() {
		UploadFS.selectFile(this.uploadFile);
	}

	uploadFile(data) {
		const file = {
			name: data.name,
			size: data.size,
			type: data.type,
		};

		const uploader = new UploadFS.Uploader({
			store: 'avatars',
			adaptive: true,
			capacity: 0.8, // 80%
			chunkSize: 8 * 1024, // 8k
			maxChunkSize: 128 * 1024, // 128k
			maxTries: 3,
			data,
			file,

			onCreate: function (avatar) {
				console.log(avatar, ' has been created');
			},
			onStart: function (avatar) {
				console.log(avatar, ' started');
			},
			onError: function (err) {
				console.error(err);
			},
			onAbort: function (avatar) {
				console.log(avatar, ' upload has been aborted');
			},
			onComplete: function (avatar) {
				console.log(avatar, ' has been uploaded');
			},
			onProgress: function (avatar, progress) {
				console.log(avatar, ' ', (progress*100), '% uploaded');
			},
			onStop: function (avatar) {
				console.log(avatar, ' stopped');
			},
		});

		uploader.start();
	}

	render() {
		return (
			<div className="user-profile-picture" 
			>
				<img src={this.state.avatarUrl} />
				
				<div className="upload-profile-picture"
					onClick={this.handleSelectFile}
					onDragStart={this.handleDragStart}
					onDragEnter={this.handleDragEnter}
					onDragOver={this.handleDragOver}
					onDragLeave={this.handleDragLeave}
					onDrop={this.handleDrop}
				>
					<i className="mdi mdi-image-area"></i>
					<span className="help-text">
						Select to upload or drag and drop.
					</span>

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