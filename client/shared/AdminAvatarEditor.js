import { Meteor } from 'meteor/meteor';
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

function getCommenterDocId() {
	const formId = AutoForm.getFormId();
	const formData = AutoForm.getCurrentDataForForm(formId);
	if (formData != null
		&& formData['doc'] != null
		&& formData.doc['_id']) {
		return formData.doc._id;
	} else {
		return null;
	}
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
				changed(newDoc, oldDoc) {
					reactiveUrl.set(newDoc.url);
				},
			});
		}
	);
}

Template.adminAvatarEditor.onCreated(function () {
	this.avatarUrl = new ReactiveVar(defaultAvatarUrl);
	if (this['avatarSubHandle'] == null) {
		const docId = getCommenterDocId();
		if (docId) {
			subscribeToAvatarUrl(docId, this.avatarUrl);
		}
	}
});

Template.adminAvatarEditor.onDestroyed(function () {
	this.avatarSubHandle.stop();
	this.avatarSubHandle = null;
});

Template.adminAvatarEditor.onRendered(function () {
	if (this['avatarSubHandle'] == null) {
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
	'click button[name=selectFile]': function (event) {
		const commenterId = getCommenterDocId();
		UploadFS.selectFile(fileData => {
			uploadAvatar(fileData, {
				type: 'commenter',
				commenterId,
			});
		});
	},
	'dragstart .avatar-image': function (event) {
		event.stopPropagation();
		return event.preventDefault();
	},
	'dragenter .avatar-image': function (event) {
		event.stopPropagation();
		return event.preventDefault();
	},
	'dragover .avatar-image': function (event) {
		event.stopPropagation();
		return event.preventDefault();
	},
	'dragleave .avatar-image': function (event) {
		event.stopPropagation();
		return event.preventDefault();
	},
	'drop .avatar-image': function (event, t) {
		event.stopPropagation();
		event.preventDefault();

		const commenterId = getCommenterDocId();
		uploadAvatar(event.originalEvent.dataTransfer.files[0], {
			type: 'commenter',
			commenterId,
		});
	},
});
