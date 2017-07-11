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
			linesFrom: commentGroup.lineFrom,
			linesTo: commentGroup.lineTo,
			nLines: commentGroup.nLines,
			'subworkFrom.n': commentGroup.subwork.n,
			'work.slug': commentGroup.work.slug
		};

	}
	console.log('commentGroup: ', commentGroup);
	console.log('translationQuery: ', translationQuery);

	const handle = Meteor.subscribe('translations', translationQuery);
	const translation = Translations.find(translationQuery).fetch();
	const lines = [];

	// TODO: loop through lines in revisions and push to lines array

	return {
		lines,
		ready: handle.ready(),
	};
}, Translation);
