import React from 'react';
import { Route } from 'react-router';

import CommenterPage from '../components/CommenterPage/CommenterPage';
import CommenterDetail from '../components/CommenterDetail/CommenterDetail';

export default (
	<Route exact path="/commenters/:slug" component={CommenterDetail} />
	<Route exact path="/commenters/" component={CommenterPage} />
);
