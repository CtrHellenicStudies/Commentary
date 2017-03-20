import { Slingshot } from 'meteor/edgee:slingshot';

Slingshot.createDirective('uploads', Slingshot.S3Storage, {
	bucket: Meteor.settings.private.aws.S3_BUCKET,
	AWSAccessKeyId: Meteor.settings.private.aws.AWS_ACCESS_KEY_ID,
	AWSSecretAccessKey: Meteor.settings.private.aws.AWS_SECRET_ACCESS_KEY,
	region: Meteor.settings.private.aws.AWS_REGION,

	acl: 'public-read',
	allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
	maxSize: 10 * 1024 * 1024, // 10 MB (use null for unlimited)

	authorize: function authorize() {
		// Deny uploads if user is not logged in.
		if (!this.userId) {
			const message = 'Please login before posting files';
			throw new Meteor.Error('Login Required', message);
		}

		return true;
	},

	key: function saveKey(file) {
		// Store file into a directory by the user's username.
		const user = Meteor.users.findOne(this.userId);
		let key = `${user._id}/${file.name}`;
		key = key.replace(/\s/g, '', 'X');

		return key;
	},
});
