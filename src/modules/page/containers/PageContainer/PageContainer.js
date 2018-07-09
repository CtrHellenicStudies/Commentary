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


const PageContainer = ({ match, pageQuery, settingsQuery, tenantId }) => {
	let page = null;
	let settings = {};
	const slug = match.params.slug;

	// redirect to / if reserved route is selected
	if (~reservedRoutes.indexOf(slug)) {
		return (
			<Redirect to="/" />
		);
	}

	if (
		pageQuery && settingsQuery
	) {
		// loading state
		if (pageQuery.loading || settingsQuery.loading) {
			return (
				<LoadingPage />
			);
		}

		// page returned from database
		if (pageQuery.page && settingsQuery.settings) {
			page = pageQuery.page;
			settings = settingsQuery.settings.find(x => x.tenantId === tenantId);
		}
	}

	// if no page is found, render 404
	if (!page || !settings) {
		return (
			<NotFound />
		);
	}

	return (
		<Page
			{...page}
			settings={settings}
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
