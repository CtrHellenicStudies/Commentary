import React from 'react';
import { Route } from 'react-router';

import ReferenceWorksPage from '../components/ReferenceWorksPage/ReferenceWorksPage';
import ReferenceWorkDetail from '../components/ReferenceWorkDetail/ReferenceWorkDetail';

const referenceWorkDetailRoute = (
	<Route exact path="/referenceWorks/:slug" component={ReferenceWorkDetail} />
);

const referenceWorkListRoute = (
	<Route exact path="/referenceWorks" render={() => <ReferenceWorksPage title="ReferenceWorks" />} />
);

export {
	referenceWorkDetailRoute, referenceWorkListRoute,
};
