import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

// lib
import Utils, { makeKeywordContextQueryFromComment } from '../../../../lib/utils';

// graphql
import commentsQuery from '../../../comments/graphql/queries/comments';
import { editionsQuery } from '../../../../graphql/methods/editions';
import { textNodesQuery } from '../../../../graphql/methods/textNodes';

class KeywordContext extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedLemma: 0,
		};
		this.toggleEdition = this.toggleEdition.bind(this);
	}
	componentWillReceiveProps(props) {
		if (props.commentsQuery.loading ||
			props.editionsQuery.loading ||
			props.textNodesQuery.loading) {
			return;
		}

		const { keyword, maxLines } = props;
		const tenantId = sessionStorage.getItem('tenantId');

		let lemmaText = [];
		const context = {};

		if (!keyword) {
			return {
				lemmaText,
				context,
			};
		}

		if (keyword.work && keyword.subwork && keyword.lineFrom
			&& !props.textNodesQuery.variables.workUrn && !props.textNodesQuery.variables.work) {


			context.work = keyword.work.slug;
			context.subwork = keyword.subwork.n;
			context.lineFrom = keyword.lineFrom;
			context.lineTo = keyword.lineTo ? keyword.lineTo : keyword.lineFrom;
			if (!props.textNodesQuery.loading) {
				const textNodesCursor = props.textNodesQuery.collections[0].textGroups[0].works;
				lemmaText = Utils.textFromTextNodesGroupedByEdition(textNodesCursor, props.editionsQuery.collections[0].textGroups[0].works);
			}
			const properties = Utils.getUrnTextNodesProperties(Utils.createLemmaCitation(
				context.work, context.lineFrom, context.lineTo
			));
			props.textNodesQuery.refetch(properties);
			return;

		} else {
			if (tenantId) {
				const query = {};
				query['keyword._id'] = keyword._id;
				props.commentsQuery.refetch({
					queryParam: JSON.stringify(query),
					limit: 1
				});
			}

			if (props.commentsQuery.comments.length > 0) {
				const comment = props.commentsQuery.comments[0];
				const query = makeKeywordContextQueryFromComment(comment, maxLines); //TODO
				context.work = query.workSlug;
				context.subwork = query.subworkN;
				context.lineFrom = query.lineFrom;
				context.lineTo = query.lineTo;
			}
			const textNodesCursor = props.textNodesQuery.collections[0].textGroups[0].works;

			lemmaText = Utils.textFromTextNodesGroupedByEdition(textNodesCursor, props.editionsQuery.collections[0].textGroups[0].works);
		}
		this.setState({
			lemmaText: lemmaText,
			context: context,
		});
	}
	toggleEdition(newSelectedLemma) {
		if (this.state.selectedLemma !== newSelectedLemma && newSelectedLemma < this.state.lemmaText.length) {
			this.setState({
				selectedLemma: newSelectedLemma,
			});
		}
	}

	render() {
		const { keyword} = this.props;
		const { context, lemmaText } = this.state;

		if (!lemmaText || !lemmaText.length) {
			return null;
		}

		return (
			<article className="comment lemma-comment paper-shadow keyword-context">
				<div>
					<span className="lemma-comment-ref-header">
						{keyword.work.title} {keyword.subwork.n}.{keyword.lineFrom}{(keyword.lineTo && keyword.lineFrom !== keyword.lineTo) ? `-${keyword.lineTo}` : ''}
					</span>
					{lemmaText[this.state.selectedLemma].lines.map((line, i) =>
						(<p
							key={i}
							className="lemma-text"
							dangerouslySetInnerHTML={{ __html: line.html }}
						/>)
					)}
				</div>
				<div className="version-tabs tabs">
					{
						lemmaText.map((lemmaTextEdition, i) => {
							const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

							return (
								<RaisedButton
									key={i}
									label={lemmaEditionTitle}
									data-edition={lemmaTextEdition.title}
									className={this.state.selectedLemma === i ? 'version-tab tab selected-version-tab' : 'version-tab tab'}
									onClick={this.toggleEdition.bind(null, i)}
								/>
							);
						})
					}
				</div>
				<div className="context-tabs tabs">
					<RaisedButton
						className="context-tab tab"
						href={`/commentary/?works=${context.work}&subworks=${context.subwork
						}&lineFrom=${context.lineFrom}&lineTo=${context.lineTo}`}
						label="Context"
						labelPosition="before"
						icon={<FontIcon className="mdi mdi-chevron-right" />}
					/>
				</div>
			</article>
		);
	}

}
KeywordContext.propTypes = {
	keyword: PropTypes.object,
	editionsQuery: PropTypes.object,
	commentsQuery: PropTypes.object,
	textNodesQuery: PropTypes.object,
	maxLines: PropTypes.number
};

export default compose(
	editionsQuery,
	commentsQuery,
	textNodesQuery
)(KeywordContext);
