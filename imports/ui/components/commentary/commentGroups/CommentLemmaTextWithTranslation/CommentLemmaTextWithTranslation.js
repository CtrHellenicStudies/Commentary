import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Translations from '/imports/models/translations';
import TranslationNodes from '/imports/models/translationNodes';
import _ from 'lodash';

class CommentLemmaTextWithTranslation extends React.Component {

	render() {
		const { commentGroup, linesWithTranslation, author } = this.props;
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
	linesWithTranslation: React.PropTypes.arrayOf(React.PropTypes.shape({
		html: React.PropTypes.string,
		english: React.PropTypes.string,
		n: React.PropTypes.number.isRequired,
	})).isRequired,
	commentGroup: React.PropTypes.object,
	author: React.PropTypes.string,
};

export default createContainer(({ commentGroup, lines, author }) => {
	let translationQuery = {};
	let translationNodesQuery = {};
	const linesWithTranslation = [];

	if (commentGroup) {
		translationQuery = {
			author: author,
			subwork: commentGroup.subwork.n,
			work: commentGroup.work.slug,
		};
		translationNodesQuery = {
			author: author,
			subwork: commentGroup.subwork.n,
			work: commentGroup.work.slug,
			$and: [{n: {$gte: commentGroup.lineFrom}}, {n: {$lte: commentGroup.lineTo}}],
		};
	}

	const handle = Meteor.subscribe('translations', Session.get('tenantId'));
	const handleNodes = Meteor.subscribe('translationNodes', Session.get('tenantId'));

	const translation = Translations.find(translationQuery).fetch();
	const translationNodes = TranslationNodes.find(translationNodesQuery).fetch();
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
	for (let i = 0; i < commentGroup.lineTo ; i++) {
		const newLine = {
			n: i + 1,
			html: lines[i].html
		};
		linesWithTranslation.push(newLine);
	}
	translationNodes.forEach((node) => {
		const arrIndex = node.n - 1;
		linesWithTranslation[arrIndex]._id = node._id;
		linesWithTranslation[arrIndex]._id = node._id;
		linesWithTranslation[arrIndex].n = node.n;
		linesWithTranslation[arrIndex].english = node.text;
	});

	return {
		linesWithTranslation,
		ready: handle.ready(),
	};
}, CommentLemmaTextWithTranslation);
