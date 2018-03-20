import React from 'react';
import { Route } from 'react-router';

import TextNodesEditorLayout from '../layouts/TextNodesLayout/TextNodesEditorLayout';

export default (
	<PrivateRoute exact path="/textNodes/edit" component={TextNodesEditorLayout} />
);
