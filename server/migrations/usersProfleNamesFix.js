import Users from '/imports/models/users';

const usersProfileNamesFix = () => {
    const users = Users.find().fetch();
    console.log(users);
	users.forEach((user) => {
        if(!user.profile)
            user.profile = {};
        if(!user.profile.name)
            user.profile.name = user.username ? user.username : user.emails[0].address;

		try {
			Users.update({
				_id: user._id,
			}, {
				$set: {
					profile: user.profile,
				},
			});
		} catch (err) {
			throw new Meteor.Error(`Error fixing user ${user._id}: ${err}`);
		}
	});
	console.log(' -- method usersProfileNamesFix run completed');
};

export default usersProfileNamesFix;
