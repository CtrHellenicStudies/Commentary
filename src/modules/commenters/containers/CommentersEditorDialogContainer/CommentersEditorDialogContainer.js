import React from 'react';


import commentersQuery from '../../graphql/queries/commenters';


const CommentersEditorDialogContainer = props => {
	const { tenantId } = props;
	let commenters = [];

	return (
		<CommentersEditorDialog
			tenantId={tenantId}
			commenters={commenters}
		/>
	);
};

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	commentersQuery,
)(CommentersEditorDialogContainer);
