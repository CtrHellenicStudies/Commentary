Meteor.startup(() => {
	// Delete all roles not in use:
	const roles = Roles.getAllRoles().fetch();
	roles.forEach((role) => {
		try {
			Roles.deleteRole(role.name);
			console.log('Deleted role:', role.name);
		} catch (err) {
			if (err.error === 403) {
				console.log('Role \'' + role.name + '\' is in use.');
			} else {
				console.log(err);
			}
		}
	});

	// Create admin and commenter roles if they don't exist:
	const startUpRoles = ['admin', 'commenter', 'developer'];
	startUpRoles.forEach((role) => {
		try {
			Roles.createRole(role);
			console.log('Created role:', role);
		} catch (err) {
					// console.log(err);
		}
	});

	// Create role for each commenter:
	// var commenters = Commenters.find().fetch();
	// commenters.forEach((commenter) => {
	//		 try {
	//				 Roles.createRole(commenter.slug);
	//				 console.log('Created role:', commenter.slug);
	//		 } catch (err) {
	//				 // console.log(err);
	//		 };
	// });

	return console.log('Roles generator finished.');
});
