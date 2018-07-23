import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import keywordsQuery from '../../graphql/queries/list';

// component
import KeywordList from '../../components/KeywordList';


const KeywordListContainer = props => {
	const { type } = props;

	let keywords = [];
	if (
		props.keywordsQuery
		&& props.keywordsQuery.keywords
	) {
		keywords = props.keywordsQuery.keywords;
	}

	switch (type) {
	case 'word':
		keywords = keywords;
		break;
	case 'idea':
		keywords = keywords;
		break;
	default:
		break;
	}

	return (
		<KeywordList
			{...props}
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
