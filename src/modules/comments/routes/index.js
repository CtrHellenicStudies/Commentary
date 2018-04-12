import React from 'react';
import { Route } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import CommentaryLayout from '../layouts/CommentaryLayout';
import AddCommentLayout from '../layouts/AddCommentLayout';
import AddRevisionLayout from '../../revisions/layouts/AddRevisionLayout/AddRevisionLayout';

const addCommentRoute = (
	<PrivateRoute
		exact
		roles={['commenter', 'editor', 'admin']}
		path="/commentary/create"
		component={AddCommentLayout}
	/>
);

const addRevisionRoute = (
	<PrivateRoute
		exact
		roles={['commenter', 'editor', 'admin']}
		path="/commentary/:commentId/edit"
		component={AddRevisionLayout}
	/>
);

const commentaryRoute = (
	<Route
		exact
		path="/commentary/:urn?"
		component={CommentaryLayout}
	/>
);

export { addCommentRoute, addRevisionRoute, commentaryRoute };
