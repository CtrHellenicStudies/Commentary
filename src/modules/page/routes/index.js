import React from 'react';
import { Route } from 'react-router';

export default (
	<Route
		path="/:slug"
		render={(params) => {
			const reservedRoutes = ['admin', 'sign-in', 'sign-up'];
			if (reservedRoutes.indexOf(params.slug) === -1) {
				return <Page slug={params.match.params.slug} />;
			}
			return <Redirect to="/" />;
		}}
	/>
);
