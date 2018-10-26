import { BrowserRouter, Switch, Route, } from 'react-router-dom';
import React from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

// lib
import PageMeta from '../lib/pageMeta';

// graphql
import tenantBySubdomainQuery from '../modules/tenants/graphql/queries/tenantBySubdomain'

// layouts
import NotFound from '../modules/notFound/components/NotFound/NotFound';

// redux
import { setTenantId } from '../modules/tenants/actions';

// modules
import {
	authRoutes, unauthorizedRoute,
} from '../modules/auth/routes';
import {
	addCommentRoute, commentaryRoute,
} from '../modules/comments/routes';
import {
	commenterDetailRoute, commenterListRoute,
} from '../modules/commenters/routes';
import homeRoute from '../modules/home/routes';
import {
	editKeywordRoute, addKeywordRoute, keywordDetailRoute, wordsListRoute,
	ideasListRoute,
} from '../modules/keywords/routes';
import {
	nrsV1Route, nrsV1RouteWithURN, nrsV2Route, nrsV1DOI,
} from '../modules/nrs/routes';
import pageRoute from '../modules/page/routes';
import {
	referenceWorkDetailRoute, referenceWorkListRoute,
} from '../modules/referenceWorks/routes';
import textNodesRoute from '../modules/textNodes/routes';
import {
	profileRoute, // publicProfileRoute,
} from '../modules/users/routes';
import {
	adminRoute,
} from '../modules/settings/routes';



/**
 * Application routes
 */
class Routes extends React.Component {
	componentWillReceiveProps(nextProps) {
		const { dispatchSetTenantId } = this.props;

		if (
			nextProps.tenantQuery
			&& nextProps.tenantQuery.tenantBySubdomain
			&& (
				!this.props.tenantQuery
				|| !this.props.tenantQuery.tenantBySubdomain
			)
		) {

			dispatchSetTenantId(nextProps.tenantQuery.tenantBySubdomain._id);
		}
	}

	render() {

		// set the base document meta for the application
		PageMeta.setBaseDocMeta();

		if (
			this.props.tenantQuery
			&& !this.props.tenantQuery.loading
			&& !this.props.tenantQuery.tenantBySubdomain
		) {
			return (
				<BrowserRouter>
					<Switch>
						<Route component={NotFound} />;
					</Switch>
				</BrowserRouter>
			);
		}

		return (
			<BrowserRouter>
				<Switch>
					{/** Home routes */}
					{homeRoute}

					{/** Commentary routes */}
					{addCommentRoute}
					{commentaryRoute}

					{/** Tags routes */}
					{editKeywordRoute}
					{addKeywordRoute}
					{keywordDetailRoute}
					{wordsListRoute}
					{ideasListRoute}

					{/** Reference works routes */}
					{referenceWorkDetailRoute}
					{referenceWorkListRoute}

					{/** Commenters routes */}
					{commenterDetailRoute}
					{commenterListRoute}

					{/** TextNode routes */}
					{textNodesRoute}

					{/** Users routes */}
					{profileRoute}
					{/* publicProfileRoute */}

					{/** Auth routes */}
					{authRoutes}
					{unauthorizedRoute}

					{/** NRS routes */}
					{nrsV1Route}
					{nrsV1RouteWithURN}
					{nrsV2Route}
					{nrsV1DOI}

					{/** Settings routes */}
					{adminRoute}

					{/** Basic page routes */}
					{pageRoute}

					{/** 404 routes */}
					<Route component={NotFound} />
				</Switch>
			</BrowserRouter>
		);
	}
}

const mapStateToProps = (state, props) => ({
	tenantId: state.tenant.tenantId,
});

const mapDispatchToProps = dispatch => ({
	dispatchSetTenantId: (tenantId) => {
		dispatch(setTenantId(tenantId));
	},
});


export default compose(
	tenantBySubdomainQuery,
	connect(mapStateToProps, mapDispatchToProps),
)(Routes);
