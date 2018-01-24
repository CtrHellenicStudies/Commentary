import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import TranslationNodes from '/imports/models/translationNodes';
import _ from 'lodash';

class CommentLemmaTextWithTranslation extends React.Component {

	render() {
		const { commentGroup, linesWithTranslation, author } = this.props;
		let nLines = 0;

		if (commentGroup) {
			nLines = commentGroup.nLines;
		}

		return (
			<div className="comment-lemma-text comment-lemma-text--with-translation">
				<label className="translated-by-label">
					Translated by {author}
				</label>
				{linesWithTranslation.map((line, i) => {
					if (line.n === 0) {
						return null;
					}
					return (
						<div
							className="translation-lemma-text-line-outer"
							key={`${line.n}-${i}`}
						>
							<div
								className="lemma-text-line lemma-text-line--source"
							>
								<span className={`line-n ${(line.n % 5) === 0 ? 'line-n--visible' : ''}`}>
									{'section' in line && line.section ? `${line.section}.` : null}{line.n}
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
					)
				})}
			</div>
		);
	}
}

CommentLemmaTextWithTranslation.propTypes = {
	linesWithTranslation: PropTypes.arrayOf(PropTypes.shape({
		html: PropTypes.string,
		english: PropTypes.string,
		n: PropTypes.number.isRequired,
		section: PropTypes.number,
	})).isRequired,
	commentGroup: PropTypes.object,
	author: PropTypes.string,
};

export default createContainer(({ commentGroup, lines, author }) => {
	let translationNodesQuery = {};
	const linesWithTranslation = [];

	if (commentGroup) {
		translationNodesQuery = {
			author: author,
			subwork: commentGroup.subwork.n,
			work: commentGroup.work.slug,
			$and: [{n: {$gte: commentGroup.lineFrom}}, {n: {$lte: commentGroup.lineTo}}],
		};
	}

	const handleNodes = Meteor.subscribe('translationNodes', Session.get('tenantId'));
	const translationNodes = TranslationNodes.find(translationNodesQuery).fetch();

	let nLines = 0;

	if (commentGroup) {
		nLines = commentGroup.nLines;
	}

	for (let i = 0; i < nLines; i++) {
		if (lines[i]) {
			const newLine = {
				n: lines[i].n,
				html: lines[i].html,
				section: lines[i].section,
			};
			linesWithTranslation.push(newLine);
		}
	}

	translationNodes.forEach((node) => {
		const arrIndex = _.findIndex(linesWithTranslation, (line) => line.n === node.n);
		linesWithTranslation[arrIndex]._id = node._id;
		linesWithTranslation[arrIndex].n = node.n;
		linesWithTranslation[arrIndex].section = node.section;
		linesWithTranslation[arrIndex].english = node.text;
	});

	return {
		linesWithTranslation,
		ready: handleNodes.ready(),
	};
}, CommentLemmaTextWithTranslation);
