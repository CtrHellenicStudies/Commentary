import { uploadAvatar } from '/imports/avatar/client/avatar_client_utils.js';
import { Avatars } from '/imports/avatar/avatar_collections.js';

AutoForm.addInputType('adminAvatarEditor', {
	template: 'adminAvatarEditor',
	valueOut() {
		return this.val();
	},
});

// TODO: this should be passed in
const defaultAvatarUrl = '/images/default_user.jpg';

function getCommenterDoc() {
	const formId = AutoForm.getFormId();
	const formData = AutoForm.getCurrentDataForForm(formId);
	if (formData != null && formData.doc != null) {
		return formData.doc;
	}

	return null;
}

function getCommenterDocId() {
	const doc = getCommenterDoc();
	if (doc != null && doc._id) {
		return doc._id;
	}

	return null;
}

function subscribeToAvatarUrl(commenterId, reactiveUrl) {
	return Meteor.subscribe(
		'avatars.commenter',
		[commenterId],
		() => {
			const cursor = Avatars.find({ commenterId });
			cursor.observe({
				added(doc) {
					reactiveUrl.set(doc.url);
				},
				changed(newDoc) {
					reactiveUrl.set(newDoc.url);
				},
				removed(oldDoc) {
					const commenter = Commenters.findOne({ _id: commenterId });
					if (!commenter || !commenter.avatar || commenter.avatar === oldDoc._id) {
						reactiveUrl.set(defaultAvatarUrl);
					}
				},
			});
		}
	);
}

Template.adminAvatarEditor.onCreated(function onCreated() {
	this.avatarUrl = new ReactiveVar(defaultAvatarUrl);
	if (this.avatarSubHandle == null) {
		const docId = getCommenterDocId();
		if (docId) {
			subscribeToAvatarUrl(docId, this.avatarUrl);
		}
	}
});

Template.adminAvatarEditor.onDestroyed(function onDestroyed() {
	this.avatarSubHandle.stop();
	this.avatarSubHandle = null;
});

Template.adminAvatarEditor.onRendered(function onRendered() {
	if (this.avatarSubHandle == null) {
		const docId = getCommenterDocId();
		if (docId) {
			subscribeToAvatarUrl(docId, this.avatarUrl);
		}
	}
});

Template.adminAvatarEditor.helpers({
	avatarUrl() {
		return Template.instance().avatarUrl.get();
	},
});

Template.adminAvatarEditor.events({
	'click button[name=selectFile]': () => {
		const commenterId = getCommenterDocId();
		UploadFS.selectFile(fileData => {
			uploadAvatar(fileData, {
				type: 'commenter',
				commenterId,
			});
		});
	},
	'click button[name=deleteAvatar]': () => {
		const commenter = getCommenterDoc();
		Meteor.call('avatar.delete', { avatarId: commenter.avatar });
	},
	'dragstart .avatar-image': (event) => {
		event.stopPropagation();
		return event.preventDefault();
	},
	'dragenter .avatar-image': (event) => {
		event.stopPropagation();
		return event.preventDefault();
	},
	'dragover .avatar-image': (event) => {
		event.stopPropagation();
		return event.preventDefault();
	},
	'dragleave .avatar-image': (event) => {
		event.stopPropagation();
		return event.preventDefault();
	},
	'drop .avatar-image': (event) => {
		event.stopPropagation();
		event.preventDefault();

		const commenterId = getCommenterDocId();
		uploadAvatar(event.originalEvent.dataTransfer.files[0], {
			type: 'commenter',
			commenterId,
		});
	},
});
