import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import keywordsQuery from '../../graphql/queries/list';

// components
import KeywordTeaser from '../KeywordTeaser';


function getKeywordsByQuery(query, limit) {
	if (query.loading) {
		return [];
	}

	return query.keywords.slice(0, limit);
}

class KeywordList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		const query = {
			type: this.props.type,
			count: { $gte: 1}
		};

		// TODO: move refetch to container
		this.props.keywordsQuery.refetch({
			tenantId: props.tenantId,
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

KeywordList.propTypes = {
	type: PropTypes.string.isRequired,
	limit: PropTypes.number,
	keywordsQuery: PropTypes.object,
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	keywordsQuery,
)(KeywordList);
