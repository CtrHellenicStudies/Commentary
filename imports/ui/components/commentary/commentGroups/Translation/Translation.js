import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

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
			'work.slug': commentGroup.work.slug,
			'subwork.n': commentGroup.subwork.n,
			'text.n': {
				$gte: commentGroup.lineFrom,
			},
		};

		if (typeof commentGroup.lineTo !== 'undefined') {
			translationQuery['text.n'].$lte = commentGroup.lineTo;
		} else {
			translationQuery['text.n'].$lte = commentGroup.lineFrom;
		}
		if (translationQuery['work.slug'] === 'homeric-hymns') {
			translationQuery['work.slug'] = 'hymns';
		}
	}

	console.log('translationQuery: ', translationQuery);

	const handle = Meteor.subscribe('translations', translationQuery);
	const translation = translations.find(translationQuery).fetch();
	const lines = [];

	// TODO: loop through lines in revisions and push to lines array

	return {
		lines,
		ready: handle.ready(),
	};
}, Translation);
