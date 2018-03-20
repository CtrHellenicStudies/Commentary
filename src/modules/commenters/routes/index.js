import React from 'react';
import { Route } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import CommenterPage from '../components/CommenterPage/CommenterPage';
import CommenterDetail from '../components/CommenterDetail/CommenterDetail';

export default (
	<Route>
		<div>
			<Route exact path="/commenters/:slug" component={CommenterDetail} />
			<Route exact path="/commenters/" component={CommenterPage} />
		</div>
	</Route>
);
