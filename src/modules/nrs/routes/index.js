import React from 'react';
import { Route } from 'react-router';

import NameResolutionServiceLayout from '../layouts/NameResolutionServiceLayout/NameResolutionServiceLayout';

const nrsV1Route = (
	<Route
		exact
		path="/v1/"
		component={NameResolutionServiceLayout}
	/>
);

const nrsV1RouteWithURN = (
	<Route
		exact
		path="/v1/:urn/:commentId"
		render={params => (
			<NameResolutionServiceLayout
				version={1}
				urn={params.match.params.urn}
				commentId={params.match.params.commentId}
			/>
		)}
	/>
);

const nrsV1DOI = (
	<Route
		exact
		path="/v1/doi:doi"
		render={params => (
			<NameResolutionServiceLayout
				version={1}
				doi={params.match.params.doi}
			/>
		)}
	/>
);

const nrsV2Route = (
	<Route
		exact
		path="/v2/:urn/:commentId"
		render={params => (
			<NameResolutionServiceLayout
				version={2}
				urn={params.match.params.urn}
				commentId={params.match.params.commentId}
			/>
		)}
	/>
);

export {
	nrsV1Route, nrsV1RouteWithURN, nrsV2Route, nrsV1DOI,
};
