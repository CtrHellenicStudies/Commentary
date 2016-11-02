import React from 'react';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { queryCommentWithKeywordId, makeKeywordContextQueryFromComment } from '../../api/api_utils.js';

export default KeywordContext = React.createClass({

	propTypes: {
		keywordId: React.PropTypes.string,
		maxLines: React.PropTypes.number.isRequired,
	},

	childContextTypes: {
		muiTheme: React.PropTypes.object.isRequired,
	},

	mixins: [ReactMeteorData],

	getInitialState() {
		return {
			selectedLemma: 0,
		};
	},

	getChildContext() {
		return { muiTheme: getMuiTheme(baseTheme) };
	},

	getMeteorData() {
		if (!this.props.keywordId) {
			return;
		}
		let lemmaText = [];
		const context = {};

		const commentsSub = Meteor.subscribe('comments.keyword_context', this.props.keywordId);

		if (commentsSub.ready()) {
			const commentCursor = queryCommentWithKeywordId(this.props.keywordId);

			if (commentCursor.count() > 0) {
				const comment = commentCursor.fetch()[0];
				const textNodesQuery = makeKeywordContextQueryFromComment(comment, this.props.maxLines);
				const textNodesSub = Meteor.subscribe('textnodes.keyword_context', textNodesQuery);

				context.work = textNodesQuery['work.slug'];
				context.subwork = textNodesQuery['subwork.n'];
				context.lineFrom = textNodesQuery['text.n'].$gte;
				context.lineTo = textNodesQuery['text.n'].$lte;

				if (textNodesSub.ready()) {
					const textNodesCursor = TextNodes.find(textNodesQuery);
					lemmaText = this.textFromTextNodesGroupedByEdition(textNodesCursor);
				}
			}
		}

		return {
			lemmaText,
			context,
		};
	},

	textFromTextNodesGroupedByEdition(nodesCursor) {
		const editions = [];
		nodesCursor.forEach(node => {
			node.text.forEach(text => {
				let myEdition = editions.find((e) => text.edition.slug === e.slug);

				if (!myEdition) {
					myEdition = {
						title: text.edition.title,
						slug: text.edition.slug,
						lines: [],
					};
					editions.push(myEdition);
				}

				myEdition.lines.push({
					html: text.html,
					n: text.n,
				});
			});
		});

		return editions;
	},

	toggleEdition(editionSlug) {
		if (this.data.lemmaText[this.state.selectedLemma].slug !== editionSlug) {
			let newSelectedLemma = {};
			this.data.lemmaText.forEach((index, edition) => {
				if (edition.slug === editionSlug) {
					newSelectedLemma = index;
				}
			});

			this.setState({
				selectedLemma: newSelectedLemma,
			});
		}
	},

	render() {
		const context = this.data.context;
		return (
			<article className="comment lemma-comment paper-shadow">
				{this.data.lemmaText.length === 0 ?
					''
					:
					this.data.lemmaText[this.state.selectedLemma].lines.map((line, i) =>
						<p
							key={i}
							className="lemma-text"
							dangerouslySetInnerHTML={{ __html: line.html }}
						/>
					)
				}
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
