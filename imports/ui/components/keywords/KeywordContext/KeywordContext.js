import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { createContainer } from 'meteor/react-meteor-data';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

// lib
import muiTheme from '/imports/lib/muiTheme';
import Utils, { queryCommentWithKeywordId, makeKeywordContextQueryFromComment } from '/imports/lib/utils';

// api
import TextNodes from '/imports/api/collections/textNodes';
import Editions from '/imports/api/collections/editions';

// const textFromTextNodesGroupedByEdition = (nodesCursor) => {
// 	const editions = [];
// 	nodesCursor.forEach((node) => {
// 		node.text.forEach((text) => {
// 			let myEdition = editions.find(e => text.edition === e._id);

// 			if (!myEdition) {
// 				const foundEdition = Editions.findOne({ _id: text.edition });
// 				myEdition = {
// 					_id: foundEdition._id,
// 					title: foundEdition.title,
// 					slug: foundEdition.slug,
// 					lines: [],
// 				};
// 				editions.push(myEdition);
// 			}

// 			myEdition.lines.push({
// 				html: text.html,
// 				n: text.n,
// 			});
// 		});
// 	});

// 	// sort lines for each edition by line number
// 	for (let i = 0; i < editions.length; ++i) {
// 		editions[i].lines.sort((a, b) => {
// 			if (a.n < b.n) {
// 				return -1;
// 			} else if (b.n < a.n) {
// 				return 1;
// 			}
// 			return 0;
// 		});
// 	}

// 	return editions;
// };


const KeywordContext = React.createClass({

	propTypes: {
		keyword: React.PropTypes.object,
		lemmaText: React.PropTypes.array,
		context: React.PropTypes.object,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
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

const KeywordContextContainer = createContainer(({ keyword, maxLines }) => {
	let lemmaText = [];
	const context = {};

	const editionsSubscription = Meteor.subscribe('editions');

	if (!keyword) {
		return {
			lemmaText,
			context,
		};
	}

	if (keyword.work && keyword.subwork && keyword.lineFrom) {
		const textNodesQuery = {
			'work.slug': keyword.work.slug,
			'subwork.n': keyword.subwork.n,
			'text.n': {
				$gte: keyword.lineFrom,
				$lte: keyword.lineFrom,
			},
		};
		if (keyword.lineTo) {
			textNodesQuery['text.n'].$lte = keyword.lineTo;
		}
		const textNodesSub = Meteor.subscribe('textnodes.keyword_context', textNodesQuery);

		context.work = textNodesQuery['work.slug'];
		context.subwork = textNodesQuery['subwork.n'];
		context.lineFrom = textNodesQuery['text.n'].$gte;
		context.lineTo = textNodesQuery['text.n'].$lte;

		if (textNodesSub.ready()) {
			const textNodesCursor = TextNodes.find(textNodesQuery);
			lemmaText = editionsSubscription ? Utils.textFromTextNodesGroupedByEdition(textNodesCursor, Editions) : [];
		}

	} else {
		const commentsSub = Meteor.subscribe('comments.keyword_context', keyword._id, Session.get('tenantId'));

		if (commentsSub.ready()) {
			const commentCursor = queryCommentWithKeywordId(keyword._id);

			if (commentCursor.count() > 0) {
				const comment = commentCursor.fetch()[0];
				const textNodesQuery = makeKeywordContextQueryFromComment(comment, maxLines);
				const textNodesSub = Meteor.subscribe('textnodes.keyword_context', textNodesQuery);

				context.work = textNodesQuery['work.slug'];
				context.subwork = textNodesQuery['subwork.n'];
				context.lineFrom = textNodesQuery['text.n'].$gte;
				context.lineTo = textNodesQuery['text.n'].$lte;

				if (textNodesSub.ready()) {
					const textNodesCursor = TextNodes.find(textNodesQuery);
					lemmaText = editionsSubscription ? Utils.textFromTextNodesGroupedByEdition(textNodesCursor, Editions) : [];
				}
			}
		}
	}

	return {
		lemmaText,
		context,
	};
}, KeywordContext);


export default KeywordContextContainer;
