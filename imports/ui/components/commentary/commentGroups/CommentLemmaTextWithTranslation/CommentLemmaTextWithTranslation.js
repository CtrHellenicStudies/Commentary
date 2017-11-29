import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';
import { compose } from 'react-apollo';
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Translations from '/imports/models/translations';
import TranslationNodes from '/imports/models/translationNodes';
import _ from 'lodash';

// graphql
import { translationsQuery } from '/imports/graphql/methods/translations';

class CommentLemmaTextWithTranslation extends Component {

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
	linesWithTranslation: PropTypes.arrayOf(PropTypes.shape({
		html: PropTypes.string,
		english: PropTypes.string,
		n: PropTypes.number.isRequired,
	})).isRequired,
	commentGroup: PropTypes.object,
	author: PropTypes.string,
};
function getTranslationQueries(query, filter) {
	if (query.loading) {
		return [];
	}
	return query.translations.filter(x => 
		x.author === filter.author &&
		x.work === filter.work && 
		x.subwork === filter.work &&
		x.n >= filter.lineFrom &&
		x.n <= filter.lineTo);
}
const cont = createContainer((props) => {

	const { commentGroup, lines, author } = props;
	let translationNodesQuery = {};
	const linesWithTranslation = [];

	if (commentGroup) {
		translationNodesQuery = {
			author: author,
			subwork: commentGroup.subwork.n,
			work: commentGroup.work.slug,
			lineFrom: commentGroup.lineFrom,
			lineTo: commentGroup.lineTo,
		};
	}

	const translationNodes = props.getTranslationQueries(translationsQuery, translationNodesQuery);

	let nLines = 0;

	if (commentGroup) {
		nLines = commentGroup.nLines;
	}

	for (let i = 0; i < nLines; i++) {
		const newLine = {
			n: lines[i].n,
			html: lines[i].html
		};
		linesWithTranslation.push(newLine);
	}
	translationNodes.forEach((node) => {
		const arrIndex = _.findIndex(linesWithTranslation, (line) => line.n === node.n);
		linesWithTranslation[arrIndex]._id = node._id;
		linesWithTranslation[arrIndex].n = node.n;
		linesWithTranslation[arrIndex].english = node.text;
	});

	return {
		linesWithTranslation,
		ready: !props.translationsQuery.loading
	};
}, CommentLemmaTextWithTranslation);
export default compose(translationsQuery)(cont);
