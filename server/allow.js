Meteor.users.allow({
	update(userId, doc, fieldNames) {
		return true;
	}	
});
