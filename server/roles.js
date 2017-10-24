/**
 * Configure roles on startup
 */
Meteor.startup(() => {
	// Delete all roles not in use:
	const roles = Roles.getAllRoles().fetch();
	roles.forEach((role) => {
		try {
			Roles.deleteRole(role.name);
			console.log('Deleted role:', role.name);
		} catch (err) {
			if (err.error === 403) {
				console.log(`Role '${role.name}' is in use.`);
			} else {
				console.log(err);
			}
		}
	});

	// Create admin and commenter roles if they don't exist:
	const startUpRoles = ['admin', 'commenter', 'editor', 'suspended'];
	startUpRoles.forEach((role) => {
		try {
			Roles.createRole(role);
		} catch (err) {
			console.log(err);
		}
	});

	return console.log('Roles generator finished.');
});
