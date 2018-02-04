import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import React, { Component } from 'react';
import _ from 'lodash';

// graphql
import { translationsQuery } from '../../../../../graphql/methods/translations';

function getTranslationQueries(query, filter) {
	if (query.loading) {
		return [];
	}
	return query.translations.filter(x =>
		x.author === filter.author &&
		x.work === filter.work &&
		x.subwork === filter.subwork &&
		x.n >= filter.lineFrom &&
		x.n <= filter.lineTo);
}
class CommentLemmaTranslation extends Component {

	componentWillReceiveProps(nextProps) {
		const { commentGroup, textNodes, author } = nextProps;
		let translationNodesQuery = {};
		const textNodesWithTranslation = [];

		if (commentGroup) {
			translationNodesQuery = {
				author: author,
				subwork: commentGroup.subwork.n,
				work: commentGroup.work.slug,
				lineFrom: commentGroup.lineFrom,
				lineTo: commentGroup.lineTo,
			};
		}

		const translationNodes = getTranslationQueries(translationsQuery, translationNodesQuery);

		let nLines = 0;

		if (commentGroup) {
			nLines = commentGroup.nLines;
		}

		for (let i = 0; i < nLines; i++) {
			const newLine = {
				n: textNodes[i].n,
				html: textNodes[i].html
			};
			textNodesWithTranslation.push(newLine);
		}
		translationNodes.forEach((node) => {
			const arrIndex = _.findIndex(textNodesWithTranslation, (line) => line.n === node.n);
			textNodesWithTranslation[arrIndex]._id = node._id;
			textNodesWithTranslation[arrIndex].n = node.n;
			textNodesWithTranslation[arrIndex].english = node.text;
		});
		this.setState({
			textNodesWithTranslation
		});
	}
	render() {
		const { author } = this.props;
		const { textNodesWithTranslation } = this.state;

		return (
			<div className="comment-lemma-text comment-lemma-text--with-translation">
				<label className="translated-by-label">
					Translated by {author}
				</label>
				{textNodesWithTranslation.map((line, i) => (
					<div
						className="translation-lemma-text-line-outer"
						key={`${line.n}-${i}`}
					>
						<div
							className="lemma-text-line lemma-text-line--source"
						>
							<span
								className={`
									line-n ${(line % 5) === 0  && line !== 0 ?
										'line-n--visible'
									:
										''}
								`}
							>
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

CommentLemmaTranslation.propTypes = {
	commentGroup: PropTypes.object,
	author: PropTypes.string,
	textNodes: PropTypes.number
};

export default compose(translationsQuery)(CommentLemmaTranslation);
