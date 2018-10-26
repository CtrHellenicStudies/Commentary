import React from 'react';
import { Route } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import CommentaryLayout from '../layouts/CommentaryLayout';
import EditorLayout from '../layouts/EditorLayout';

const addCommentRoute = (
	<PrivateRoute
		exact
		roles={['commenter', 'editor', 'admin']}
		path="/commentary/create"
		component={EditorLayout}
	/>
);

const commentaryRoute = (
	<Route
		exact
		path="/commentary/:urn?"
		component={CommentaryLayout}
	/>
);

export { addCommentRoute, commentaryRoute };
