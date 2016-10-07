import { Meteor } from 'meteor/meteor';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { queryCommentWithKeyword, makeKeywordContextQueryFromComment } from '../../api/api_utils.js';

export default KeywordContext = React.createClass({

	mixins: [ReactMeteorData],

	propTypes: {
		slug: React.PropTypes.string.isRequired,
		maxLines: React.PropTypes.number.isRequired,
	},

	getInitialState() {
		return {
			selectedLemmaEdition: {
				lines: [],
			},
		}
	},

	getMeteorData() {
		let lemmaText = [];

		const commentsSub = Meteor.subscribe('comments.keyword_context', this.props.slug);

		if (commentsSub.ready()) {
			const commentCursor = queryCommentWithKeyword(this.props.slug);
			if (commentCursor.count() > 0) {
				const comment = commentCursor.fetch()[0];

				const textNodesQuery = makeKeywordContextQueryFromComment(comment, this.props.maxLines);
				const textNodesSub = Meteor.subscribe('textnodes.keyword_context', textNodesQuery);

				if (textNodesSub.ready()) {
					const textNodesCursor = TextNodes.find(textNodesQuery);
					lemmaText = this.textFromTextNodesGroupedByEdition(textNodesCursor);
				}
			}
		}

		return {
			lemmaText,
		};
	},

	textFromTextNodesGroupedByEdition(nodesCursor) {
		const editions = [];
		nodesCursor.forEach(node => {
			node.text.forEach(text => {
				let myEdition = editions.find((e) => {
					return text.edition.slug === e.slug;
				});

				if (!myEdition) {
					myEdition = {
						title: text.edition.title,
						slug: text.edition.slug,
						lines: [],
					}
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

	toggleEdition(editionSlug){
		if(this.state.selectedLemmaEdition.slug !== editionSlug){
			var newSelectedEdition = {};
			this.data.lemmaText.forEach(function(edition){
				if(edition.slug === editionSlug){
					newSelectedEdition = edition;
				}
			});

			this.setState({
				selectedLemmaEdition: newSelectedEdition
			});
		}
	},

	componentDidUpdate(){
		if (this.data.lemmaText.length > 0 && this.state.selectedLemmaEdition.lines.length === 0) {
			this.setState({
				selectedLemmaEdition: this.data.lemmaText[0]
			});
		}
	},

	render() {
		return (<article className="comment lemma-comment paper-shadow">
			{
				this.state.selectedLemmaEdition.lines.map((line, i) => {
					return <p
						key={i}
						className="lemma-text"
						dangerouslySetInnerHTML={{__html: line.html}}
					/>;
				})
			}
			<div className="edition-tabs tabs">
				{
					this.data.lemmaText.map((lemmaTextEdition, i) => {
						let lemmaEditionTitle = Utils.trunc(lemmaTextEdition.title, 20);

						return <RaisedButton
							key={i}
							label={lemmaEditionTitle}
							data-edition={lemmaTextEdition.title}
							className={this.state.selectedLemmaEdition.slug === lemmaTextEdition.slug ? "edition-tab tab selected-edition-tab" : "edition-tab tab"}
							onClick={this.toggleEdition.bind(null, lemmaTextEdition.slug)}
						>
						</RaisedButton>
					})
				}
			</div>
		</article>);
	},

});
