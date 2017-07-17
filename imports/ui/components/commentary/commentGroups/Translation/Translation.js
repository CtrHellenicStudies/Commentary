import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

// api
import Translations from '/imports/api/collections/translations';

class Translation extends React.Component {
	render() {
		const { commentGroup, lines } = this.props;
		console.log('commentGroup: ', commentGroup);
		return (
			<div>
				{lines.map(line => <p key={line.n}>{line.text}</p>)}
			</div>
		);
	}
}

export default createContainer(({ commentGroup }) => {
	let translationQuery = {};

	if (commentGroup) {
		translationQuery = {
			author: 'CHS',
			subwork: Number(commentGroup.subwork.title),
			work: commentGroup.work.slug,
		};
	}
	console.log('commentGroup: ', commentGroup);
	console.log('translationQuery: ', translationQuery);

	const handle = Meteor.subscribe('translations', Session.get('tenantId'));

	console.log('Found ', Translations.find().fetch().length, ' translations.');
	console.log('Sample translation record: ', Translations.find().fetch()[0]);

	const translation = Translations.find(translationQuery).fetch();

	let lines = [];

	if (translation[0]) {
		console.log('Translation found.');
		const lineFrom = commentGroup.lineFrom;
		const lineTo = commentGroup.lineTo;

		const text = translation[0].revisions[0].text;

		lines = text.slice(lineFrom - 1, lineTo);
	}

	console.log('Translation not found.');

	return {
		lines,
		ready: handle.ready(),
	};
}, Translation);
