import React from 'react';
import PropTypes from 'prop-types';
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import { fromJS } from 'immutable';

// lib
import getSuggestionsFromComments from '../../lib/getSuggestionsFromComments';


class Suggestions extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mentions: fromJS([]),
			keywords: fromJS([])
		};
	}

	onMentionSearchChange({ value }) {
		const _mentions = getSuggestionsFromComments(this.props.comments);
		this.setState({
			mentions: defaultSuggestionsFilter(value, fromJS(_mentions))
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
		const { mentionPlugin, keywordPlugin } = this.props;
		return (
			<div>
				<div>
					<mentionPlugin.MentionSuggestions
						onSearchChange={this.onMentionSearchChange.bind(this)}
						suggestions={this.state.mentions}
					/>
					<keywordPlugin.MentionSuggestions
						onSearchChange={this.onKeywordSearchChange.bind(this)}
						suggestions={this.state.keywords}
					/>
				</div>
			</div>
		);
	}
}

Suggestions.propTypes = {
	mentionPlugin: PropTypes.object,
	keywordPlugin: PropTypes.object,
	comments: PropTypes.array,
	keywords: PropTypes.array,
	tenantId: PropTypes.string,
};

export default Suggestions;
