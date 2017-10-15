/**
 * Define meteor users permissions for updating documents
 */

ownsDocument(userId, doc) {
		return doc && doc.userId === userId;
};

Meteor.users.allow({
	update: this.ownsDocument
});
