import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { compose } from 'react-apollo';
import { createContainer } from 'meteor/react-meteor-data';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils, { queryCommentWithKeywordId, makeKeywordContextQueryFromComment } from '/imports/lib/utils';

// graphql
import { editionsQuery } from '/imports/graphql/methods/editions';
import { textNodesQuery } from '/imports/graphql/methods/textNodes';
import { commentsQuery } from '/imports/graphql/methods/comments';

// models
import TextNodes from '/imports/models/textNodes';

const KeywordContext = React.createClass({

	propTypes: {
		keyword: PropTypes.object,
		lemmaText: PropTypes.array,
		context: PropTypes.object,
	},

	childContextTypes: {
		muiTheme: PropTypes.object.isRequired,
	},

	getInitialState() {
		return {
			selectedLemma: 0,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(muiTheme) };
	},

	toggleEdition(newSelectedLemma) {
		if (this.state.selectedLemma !== newSelectedLemma && newSelectedLemma < this.props.lemmaText.length) {
			this.setState({
				selectedLemma: newSelectedLemma,
			});
		}
	},

	render() {
		const { keyword, context, lemmaText } = this.props;

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
				<div className="edition-tabs tabs">
					{
						lemmaText.map((lemmaTextEdition, i) => {
							const lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

							return (
								<RaisedButton
									key={i}
									label={lemmaEditionTitle}
									data-edition={lemmaTextEdition.title}
									className={this.state.selectedLemma === i ? 'edition-tab tab selected-edition-tab' : 'edition-tab tab'}
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
	},

});

const KeywordContextContainer = createContainer(props => {

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

	if (keyword.work && keyword.subwork && keyword.lineFrom) {

		if (tenantId) {
			props.textNodesQuery.refetch({
				tenantId: tenantId,
				workSlug: keyword.work.slug,
				subworkN: keyword.subwork.n,
				lineFrom: keyword.lineFrom,
				lineTo: keyword.lineTo ? keyword.lineTo : keyword.lineFrom
			});
			
		}

		context.work = keyword.work.slug;
		context.subwork = keyword.subwork.n;
		context.lineFrom = keyword.lineFrom;
		context.lineTo = keyword.lineTo ? keyword.lineTo : keyword.lineFrom;

		if (!props.textNodesQuery.loading) {
			const textNodesCursor = props.textNodesQuery.textNodes;
			lemmaText = !props.editionsQuery.loading ? 
				Utils.textFromTextNodesGroupedByEdition(textNodesCursor, props.editionsQuery.editions) : [];
		}

	} else {
		if (tenantId) {
			const query = {};
			query['keyword._id'] = keyword._id;
			query.tenantId = tenantId;
			props.commentsQuery.refetch({
				queryParam: JSON.stringify(query),
				limit: 1
			});
		}
		
		if (!props.commentsQuery.loading) {

			if (props.commentsQuery.comments.length > 0) {
				const comment = props.commentsQuery.comments[0];
				const query = makeKeywordContextQueryFromComment(comment, maxLines);
				if (tenantId) {
					props.textNodesQuery.refetch(query);
				}
				context.work = query.workSlug;
				context.subwork = query.subworkN;
				context.lineFrom = query.lineFrom;
				context.lineTo = query.lineTo;

				if (!props.textNodesQuery.loading) {
					const textNodesCursor = TextNodes.find(textNodesQuery);
					lemmaText = !props.editionsQuery.loading ?
						Utils.textFromTextNodesGroupedByEdition(textNodesCursor, props.editionsQuery.editions) : [];
				}
			}
		}
	}

	return {
		lemmaText,
		context,
	};
}, KeywordContext);


export default compose(
	editionsQuery,
	commentsQuery,
	textNodesQuery
)(KeywordContextContainer);
