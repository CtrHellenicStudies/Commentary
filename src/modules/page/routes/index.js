import React from 'react';
import { Route } from 'react-router';

import PageContainer from '../containers/PageContainer';

export default (
	<Route
		path="/:slug"
		component={PageContainer}
	/>
);
