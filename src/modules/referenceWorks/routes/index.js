import React from 'react';
import { Route } from 'react-router';

import ReferenceWorksPage from '../components/ReferenceWorksPage/ReferenceWorksPage';
import ReferenceWorkDetail from '../components/ReferenceWorkDetail/ReferenceWorkDetail';

export default (
	<Route>
		<div>
			<Route exact path="/referenceWorks/:slug" component={ReferenceWorkDetail} />
			<Route exact path="/referenceWorks" render={() => <ReferenceWorksPage title="ReferenceWorks" />} />
		</div>
	</Route>
);
