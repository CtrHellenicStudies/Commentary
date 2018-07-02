import React from 'react';
import { Route } from 'react-router';

import ReferenceWorkPageContainer from '../containers/ReferenceWorkPageContainer';
import ReferenceWorkDetail from '../components/ReferenceWorkDetail/ReferenceWorkDetail';

const referenceWorkDetailRoute = (
	<Route exact path="/referenceWorks/:slug" component={ReferenceWorkDetail} />
);

const referenceWorkListRoute = (
	<Route exact path="/referenceWorks" component={ReferenceWorkPageContainer} />
);

export {
	referenceWorkDetailRoute, referenceWorkListRoute,
};
