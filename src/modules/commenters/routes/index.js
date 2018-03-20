import React from 'react';
import { Route } from 'react-router';

export default (
	<Route path="/commenters/:slug" render={params => <CommenterDetail {...params} defaultAvatarUrl="/images/default_user.jpg" />} />
	<Route exact path="/commentators" component={CommentersPage} />
);
