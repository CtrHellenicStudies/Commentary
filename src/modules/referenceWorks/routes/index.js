import React from 'react';
import { Route } from 'react-router';

import ReferenceWorkPageContainer from '../containers/ReferenceWorkPageContainer';
import ReferenceWorkDetailContainer from '../containers/ReferenceWorkDetailContainer';

const referenceWorkDetailRoute = (
	<Route exact path="/referenceWorks/:slug" component={ReferenceWorkDetailContainer} />
);

const referenceWorkListRoute = (
	<Route exact path="/referenceWorks" component={ReferenceWorkPageContainer} />
);

export {
	referenceWorkDetailRoute, referenceWorkListRoute,
};
