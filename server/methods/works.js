import { Meteor } from 'meteor/meteor';
import Works from '/imports/collections/works';

Meteor.methods({
	'works.insert': (data) => {
		check(data, Object);

		return Works.insert(data);
	},
	'works.remove': (_id) => {
		check(_id, String);

		Works.remove(_id);
	},
	'works.update': (_id, work) => {
		check(_id, String);
		check(work, Object);
		check(work.title, String);

		Works.update({
			_id
		}, {
			$set: {
				title: work.title,
			}
		});
	}
});
