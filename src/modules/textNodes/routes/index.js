import React from 'react';
import { Route } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import TextNodesEditorLayout from '../layouts/TextNodesLayout/TextNodesEditorLayout';

export default (
	<PrivateRoute exact path="/textNodes/edit" component={TextNodesEditorLayout} />
);
