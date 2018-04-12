import React from 'react';

import PrivateRoute from '../../../routes/PrivateRoute';
import TextNodesEditorLayout from '../layouts/TextNodesLayout/TextNodesEditorLayout';

export default (
	<PrivateRoute
		exact
		path="/textNodes/edit"
		component={TextNodesEditorLayout}
		roles={['commenter', 'editor', 'admin']}
	/>
);
