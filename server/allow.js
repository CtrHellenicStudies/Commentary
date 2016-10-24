ProfilePictures.allow({
	insert(userId, doc) {
		return true;
	},
	update(userId, doc, fieldNames, modifier) {
		return true;
	},
	download(userId) {
		return true;
	},
});

Attachments.allow({
	insert(userId, doc) {
		return true;
	},
	update(userId, doc, fieldNames, modifier) {
		return true;
	},
	download(userId) {
		return true;
	},
});


Meteor.users.allow({
	update(userId, doc, fieldNames, modifier) {
		if (userId === doc._id && !doc.username && fieldNames.length === 1 && fieldNames[0] === 'username') {
			return true;
		} else {
			return false;
		}
	},
});
