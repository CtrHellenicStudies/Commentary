import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import Works from '/imports/collections/works';

Meteor.methods({
	'works.insert': (work) => {
		check(work, Object);
		check(work.title, String);
		check(work.tenantId, Match.Maybe(String));
		check(work.order, Match.Maybe(Number));
		check(work.subworks, Match.Maybe(Array));

		if ('subworks' in work) {
			work.subworks.forEach((subwork) => {
				check(subwork.title, String);
				check(subwork.slug, String);
				check(subwork.n, Number);
			});
		}

		return Works.insert(work);
	},
	'works.remove': (_id) => {
		check(_id, String);

		Works.remove(_id);
	},
	'works.update': (_id, work) => {
		check(_id, String);
		check(work, Object);
		check(work.title, String);
		check(work.tenantId, Match.Maybe(String));
		check(work.order, Match.Maybe(Number));
		check(work.subworks, Match.Maybe(Array));

		if ('subworks' in work) {
			work.subworks.forEach((subwork) => {
				check(subwork.title, String);
				check(subwork.slug, String);
				check(subwork.n, Number);
			});
		}

		Works.update({
			_id
		}, {
			$set: work,
		});
	}
});
