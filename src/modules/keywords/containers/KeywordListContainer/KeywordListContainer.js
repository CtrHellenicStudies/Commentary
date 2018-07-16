import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import keywordsQuery from '../../graphql/queries/list';


const KeywordListContainer = props => {

	const { type, limit } = props;
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

	return (
		<KeywordList
			keywords={keywords}
		/>
	);
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	keywordsQuery,
)(KeywordListContainer);
