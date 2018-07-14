import React from 'react';
import PropTypes from 'prop-types';
import { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import { fromJS } from 'immutable';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// lib
import Utils from '../../../../lib/utils';

// graphql
import commentsQuery from '../../../comments/graphql/queries/comments';
import keywordsQuery from '../../../keywords/graphql/queries/list';


class Suggestions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mentions: fromJS([]),
			keywords: fromJS([])
		};

		// TODO: move this to container
		props.keywordsQuery.refetch({
			tenantId: props.tenantId,
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			tags: nextProps.keywordsQuery.loading ? [] : nextProps.keywordsQuery.keywords,
			comments: nextProps.commentsQuery.loading ? [] : nextProps.commentsQuery.comments
		});
	}

	onMentionSearchChange({ value }) {
		this.props.commentsQuery.refetch({
			queryParam: JSON.stringify({ $text: { $search: value } }),
			limit: 5
		}).then(function(res) {
			const _mentions = Utils.getSuggestionsFromComments(res.data.comments);
			this.setState({
				mentions: defaultSuggestionsFilter(value, fromJS(_mentions))
			});
		});
	}

	onKeywordSearchChange({ value }) {
		const _keywords = [];
		this.state.tags.forEach((keyword) => {
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
		return (
			<div>
				{this.state.tags !== undefined ? (
					<div>
						<this.props.mentionPlugin.MentionSuggestions
							onSearchChange={this.onMentionSearchChange.bind(this)}
							suggestions={this.state.mentions}
						/>
						<this.props.keywordPlugin.MentionSuggestions
							onSearchChange={this.onKeywordSearchChange.bind(this)}
							suggestions={this.state.keywords}
						/>
					</div>) : ''
				}
			</div>
		);
	}
}

Suggestions.propTypes = {
	mentionPlugin: PropTypes.object,
	keywordPlugin: PropTypes.object,
	commentsQuery: PropTypes.object,
	keywordsQuery: PropTypes.object
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});


export default compose(
	keywordsQuery,
	commentsQuery,
	connect(mapStateToProps),
)(Suggestions);
