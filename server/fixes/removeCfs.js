import Commenters from '/imports/api/collections/commenters';

Meteor.method('removeCfs', () => {
	const db = Meteor.users.rawDatabase();

	const dropCollection = (collectionName) => {
		db.dropCollection(collectionName, (err, result) => {
			if (err) {
				if (err.message !== 'ns not found') {
					console.error('could not drop ', collectionName, ' err:', err);
				} else {
					console.log(collectionName, ' does not exist.');
				}
			} else {
				console.log('dropped ', collectionName, ' result:', result);
			}
		});
	};

	dropCollection('cfs.Attachments.filerecord');
	dropCollection('cfs._tempstore.chunks');
	dropCollection('cfs.profilePictures.filerecord');
	dropCollection('cfs_gridfs._tempstore.chunks');
	dropCollection('cfs_gridfs._tempstore.files');
	dropCollection('cfs_gridfs.attachments.chunks');
	dropCollection('cfs_gridfs.attachments.files');
	dropCollection('cfs_gridfs.images.chunks');
	dropCollection('cfs_gridfs.images.files');
	dropCollection('cfs_gridfs.thumbs.chunks');
	dropCollection('cfs_gridfs.thumbs.files');

	Commenters.rawCollection().updateMany(
		{
			picture: { $exists: true },
		},
		{
			$unset: { picture: '' },
		}, (err) => {
			if (err) {
				console.log('error remove picture from commenters. err:', err);
			} else {
				console.log('removed picture from commenters.');
			}
		}
	);
});
