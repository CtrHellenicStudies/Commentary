import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'react-apollo';

// graphql
import commentersQuery from '../../../commenters/graphql/queries/list';
import referenceWorksQuery from '../../../referenceWorks/graphql/queries/list';
import keywordsQuery from '../../../keywords/graphql/queries/list';
import { editionsQuery } from '../../../textNodes/graphql/queries/editions';

// component
import CommentarySearchPanel from '../../components/CommentarySearchPanel';


const handleChangeTextsearch = (val) => {

};


const CommentarySearchPanelContainer = props => {

	return (
		<CommentarySearchPanel
			open={props.open}
			closeRightMenu={props.closeRightMenu}
			handleChangeTextsearch={handleChangeTextsearch}
		/>
	);
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentersQuery,
	referenceWorksQuery,
	keywordsQuery,
	editionsQuery
)(CommentarySearchPanelContainer);
