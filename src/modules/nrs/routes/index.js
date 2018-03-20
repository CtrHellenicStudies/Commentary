import React from 'react';
import { Route } from 'react-router';

import NameResolutionServiceLayout from '../layouts/NameResolutionServiceLayout/NameResolutionServiceLayout';

export default (
	<Route>
		<div>
			<Route
				exact
				path="/v1/"
				component={NameResolutionServiceLayout}
			/>

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
		</div>
	</Route>
);
