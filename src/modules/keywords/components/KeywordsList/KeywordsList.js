import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { compose } from 'react-apollo';

// graphql
import { keywordsQuery } from '../../graphql/queries/keywords';

// components
import KeywordTeaser from '../KeywordsTeaser/KeywordTeaser';

function getKeywordsByQuery(query, limit) {

	if (query.loading) {
		return [];
	}
	return query.keywords.slice(0, limit);
}

class KeywordsList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		const tenantId = sessionStorage.getItem('tenantId');

		const query = {
			type: this.props.type,
			count: { $gte: 1}
		};
		this.props.keywordsQuery.refetch({
			tenantId: tenantId,
			queryParam: JSON.stringify(query)
		});
	}

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

	componentWillReceiveProps(newProps) {
		const { type, limit } = newProps;
		let _limit = 100;

		let keywords = [];
		if (limit) {
			_limit = limit;
		}
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
	keywordsQuery: PropTypes.object,
};

export default compose(keywordsQuery)(KeywordsList);
