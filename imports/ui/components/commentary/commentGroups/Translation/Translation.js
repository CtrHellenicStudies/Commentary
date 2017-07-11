import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// api
import Translations from '/imports/api/collections/translations';

class Translation extends React.Component {
	render() {
		const { commentGroup } = this.props;
		console.log('commentGroup: ', commentGroup);
		return (
			<p>Hey now</p>
		);
	}
}

export default createContainer(({ commentGroup }) => {
	let translationQuery = {};

	if (commentGroup) {
		translationQuery = {
			author: 'CHS',
			subworkFrom: commentGroup.subwork.title,
			work: commentGroup.work.slug
		};

	}
	console.log('commentGroup: ', commentGroup);
	console.log('translationQuery: ', translationQuery);

	const handle = Meteor.subscribe('translations', Session.get('tenantId'));

	const translation = Translations.find(translationQuery).fetch();

	const linesFrom = commentGroup.linesFrom;
	const linesTo = commentGroup.linesTo;

	if (translation[0]) {
		const text = translation[0].revisions[0].text;

		const lines = text.slice(0, 15);

		console.log('found translation: ', translation);
		console.log('lines: ', lines);
	}
	

	

	// TODO: loop through lines in revisions and push to lines array

	return {
		ready: handle.ready(),
	};
}, Translation);
