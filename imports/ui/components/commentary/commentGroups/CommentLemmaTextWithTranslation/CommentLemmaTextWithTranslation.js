import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import _ from 'lodash';

// graphql
import { translationsQuery } from '/imports/graphql/methods/translations';

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
class CommentLemmaTextWithTranslation extends Component {

	componentWillReceiveProps(nextProps) {
		const { commentGroup, lines, author } = nextProps;
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
	
		const translationNodes = getTranslationQueries(translationsQuery, translationNodesQuery);
	
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
		this.setState({
			linesWithTranslation
		});
	}
	render() {
		const { commentGroup, author } = this.props;
		const { linesWithTranslation } = this.state;
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
							<span
								className={`
									line-n ${(lines[i].n % 5) === 0  && lines[i].n !== 0 ?
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

CommentLemmaTextWithTranslation.propTypes = {
	commentGroup: PropTypes.object,
	author: PropTypes.string,
	lines: PropTypes.number
};

export default compose(translationsQuery)(CommentLemmaTextWithTranslation);
