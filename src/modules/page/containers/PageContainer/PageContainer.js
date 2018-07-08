import React from 'react';
import { Redirect } from 'react-router';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// graphql
import settingsQuery from '../../../settings/graphql/queries/list';
import pageQuery from '../../graphql/queries/detail';

// components
import NotFound from '../../../notFound/components/NotFound';
import LoadingPage from '../../../../components/loading/LoadingPage';
import Page from '../../components/Page';

// list of reserved routes that should not render pages
const reservedRoutes = ['admin', 'sign-in', 'sign-up'];


const PageContainer = ({ slug, pageQuery, settingsQuery, tenantId }) => {
	let page = null;

	// redirect to / if reserved route is selected
	if (~reservedRoutes.indexOf(slug)) {
		return (
			<Redirect to="/" />
		);
	}

	if (
		pageQuery
	) {
		// loading state
		if (pageQuery.loading) {
			return (
				<LoadingPage />
			);
		}

		// page returned from database
		if (pageQuery.page) {
			page = pageQuery.page;
		}
	}

	// if no page is found, render 404
	if (!page) {
		return (
			<NotFound />
		);
	}

	return (
		<Page
			{...page}
		/>
	);
};


const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

export default compose(
	connect(mapStateToProps),
	settingsQuery,
	pageQuery,
)(PageContainer);
