import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Translations from '/imports/api/collections/translations';
import _ from 'lodash';

class CommentLemmaTextWithTranslation extends React.Component {

	render() {
		const { lines, commentGroup, linesWithTranslation, author } = this.props;
		const nLines = commentGroup.nLines;

		return (
			<div className="comment-lemma-text comment-lemma-text--with-translation">
				<label className="translated-by-label">
					Translated by {author}
				</label>
				{linesWithTranslation.map((line, i) => (
					<div
						className="translation-lemma-text-line-outer"
						key={`${line.n}-${i}`}
					>
						<div
							className="lemma-text-line lemma-text-line--source"
						>
							<span className={`line-n ${(line.n % 5) === 0 ? 'line-n--visible' : ''}`}>
								{line.n}
							</span>
							<p
								className="lemma-text"
								dangerouslySetInnerHTML={{ __html: line.html }}
							/>
						</div>
						<div
							className="lemma-text-line lemma-text-line--translation"
						>
							<p className="translation-text">
								{line.english}
							</p>
						</div>
					</div>
				))}
			</div>
		);
	}
}

CommentLemmaTextWithTranslation.propTypes = {
	lines: React.PropTypes.arrayOf(React.PropTypes.shape({
		html: React.PropTypes.string.isRequired,
		n: React.PropTypes.number.isRequired,
	})).isRequired,
};

export default createContainer(({ commentGroup, lines, author }) => {
	let translationQuery = {};

	if (commentGroup) {
		translationQuery = {
			author: author,
			subwork: Number(commentGroup.subwork.title),
			work: commentGroup.work.slug,
		};
	}

	const handle = Meteor.subscribe('translations', Session.get('tenantId'));

	const translation = Translations.find(translationQuery).fetch();

	const translationLines = [];

	if (translation[0]) {
		const lineFrom = commentGroup.lineFrom;
		const lineTo = commentGroup.lineTo;

		const text = translation[0].revisions[0].text;

		const translationObjects = text.slice(lineFrom - 1, lineTo);
		for (const object of translationObjects) {
			translationLines.push(object.text);
		}
	}

	const linesWithTranslation = _.zipWith(lines, translationLines, (item, value) => (
		_.defaults({
			english: value,
		}, item)
	));

	return {
		linesWithTranslation,
		ready: handle.ready(),
	};
}, CommentLemmaTextWithTranslation);
