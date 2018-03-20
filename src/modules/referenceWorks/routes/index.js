import React from 'react';
import { Route } from 'react-router';

export default (
	<Route exact path="/referenceWorks/:slug" component={ReferenceWorkDetail} />
	<Route exact path="/referenceWorks" render={() => <ReferenceWorksPage title="ReferenceWorks" />} />
);
