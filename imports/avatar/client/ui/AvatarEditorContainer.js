import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import AvatarEditor from './AvatarEditor.jsx';

function handleUploadAvatar() {
	UploadFS.selectFiles(function handleAvatarSelected(data) {
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
	});
};

export default AvatarEditorContainer = createContainer((props) => {
	const myAvatarHandle = Meteor.subscribe('users.myAvatar');

	return {
		handleUploadAvatar,
		defaultAvatarUrl: props.defaultAvatarUrl,
		avatar: Meteor.user().avatar,
		avatarLoading: !myAvatarHandle.ready(),
	};
}, AvatarEditor);