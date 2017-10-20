import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { HOC as formsyHOC } from 'formsy-react';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import { createContainer } from 'meteor/react-meteor-data';
import Keywords from '/imports/models/keywords';
import { fromJS } from 'immutable';

function _getSuggestionsFromComments(comments) {
	const suggestions = [];

	// if there are comments:
	if (comments.length) {

		// loop through all comments
		// add suggestion for each comment
		comments.forEach((comment) => {

			// get the most recent revision
			const revision = comment.revisions[comment.revisions.length - 1];

			const suggestion = {
				// create suggestio name:
				name: `"${revision.title}" -`,

				// set link for suggestion
				link: `/commentary?_id=${comment._id}`,

				// set id for suggestion
				id: comment._id,
			};

			// loop through commenters and add them to suggestion name
			comment.commenters.forEach((commenter, i) => {
				if (i === 0) suggestion.name += ` ${commenter.name}`;
				else suggestion.name += `, ${commenter.name}`;
			});

			suggestions.push(suggestion);
		});
	}
	return suggestions;
}
class Suggestions extends Component {

	constructor(props){
		super(props);
		this.onMentionSearchChange = this.onMentionSearchChange.bind(this);
		this.onKeywordSearchChange = this.onKeywordSearchChange.bind(this);
		this.state = {
			mentions: fromJS([]),
			keywords: fromJS([])
		};
	}
	onMentionSearchChange({ value }) {
		// use Meteor call method, as comments are not available on clint app
		Meteor.call('comments.getSuggestions', value, (err, res) => {
			// handle error:
			if (err) throw new Meteor.Error(err);

			// handle response:
			const _mentions = _getSuggestionsFromComments(res);

			this.setState({
				mentions: defaultSuggestionsFilter(value,fromJS(_mentions))
			});
		});
	}
	onKeywordSearchChange({ value }) {
		const _keywords = [];
		this.props.tags.forEach((keyword) => {
			_keywords.push({
				name: keyword.title,
				link: `/tags/${keyword.slug}`,
			});
		});

		this.setState({
			keywords: defaultSuggestionsFilter(value, fromJS(_keywords)),
		});
	}
	render() {
		const { MentionSuggestions } = this.props.mentionPlugin;
		const KeywordsSuggestions = this.props.keywordPlugin.MentionSuggestions;
		return (
				<div>
					{this.props.tags !== undefined ? (
						<div>
							<MentionSuggestions
							onSearchChange={this.onMentionSearchChange}
							suggestions={this.state.mentions}
								/>
							<KeywordsSuggestions
							onSearchChange={this.onKeywordSearchChange}
							suggestions={this.state.keywords}
							/>
						</div>) : ''
					}
			</div>
		);
	}
}
export default createContainer(() => {
	Meteor.subscribe('keywords.all', { tenantId: Session.get('tenantId') });

	const tags = Keywords.find().fetch();
	return {
		tags
	}
}, Suggestions);
