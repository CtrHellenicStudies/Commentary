import React from 'react';
import { Route } from 'react-router';

import CommenterPage from '../components/CommenterPage/CommenterPage';
import CommenterDetail from '../components/CommenterDetail/CommenterDetail';

const commenterDetailRoute = (
	<Route exact path="/commenters/:slug" component={CommenterDetail} />
);

const commenterListRoute = (
	<Route exact path="/commenters/" component={CommenterPage} />
);

export {
	commenterDetailRoute, commenterListRoute,
};
