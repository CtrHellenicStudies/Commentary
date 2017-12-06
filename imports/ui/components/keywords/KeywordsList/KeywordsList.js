import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { compose } from 'react-apollo';

// models
import Keywords from '/imports/models/keywords';

// graphql
import { keywordsQuery } from '/imports/graphql/methods/keywords';

// components
import KeywordTeaser from '/imports/ui/components/keywords/KeywordTeaser';

function getKeywordsByQuery(query, limit) {

	if (query.loading) {
		return [];
	}
	return query.keywords.slice(0, limit);
}

class KeywordsList extends Component {

	renderKeywords() {
		const { keywords } = this.state;

		if (!keywords) {
			return null;
		}

		return keywords.map((keyword, i) => (
			<KeywordTeaser
				key={i}
				keyword={keyword}
			/>
		));
	}
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentWillReceiveProps(newProps) {
		const { type, limit } = newProps;
		const skip = 0;
		const tenantId = sessionStorage.getItem('tenantId');
		let _limit = 100;
		const query = {
			type: type,
			count: { $gte: 1}
		};
		if (limit) {
			_limit = limit;
		}
		newProps.keywordsQuery.refetch({
			tenantId: tenantId,
			queryParam: JSON.stringify(query)
		});
	
		let keywords = [];
		switch (type) {
		case 'word':
			keywords = getKeywordsByQuery(newProps.keywordsQuery, _limit);
			break;
		case 'idea':
			keywords = getKeywordsByQuery(newProps.keywordsQuery, _limit);
			break;
		default:
			break;
		}
		this.setState({
			keywords: keywords,
		});
	}

	render() {
		return (
			<div className="keywords-list">
				{this.renderKeywords()}
			</div>
		);
	}
}

KeywordsList.propTypes = {
	type: PropTypes.string.isRequired,
	limit: PropTypes.number,
	keywords: PropTypes.array,
};

export default compose(keywordsQuery)(KeywordsList);
