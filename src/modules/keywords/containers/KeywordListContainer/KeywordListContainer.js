import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import keywordsQuery from '../../graphql/queries/list';

// component
import KeywordList from '../../components/KeywordList';


const KeywordListContainer = props => {
	let keywords = [];
	if (
		props.keywordsQuery
		&& props.keywordsQuery.keywords
	) {
		keywords = props.keywordsQuery.keywords;
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
