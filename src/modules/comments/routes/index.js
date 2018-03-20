import React from 'react';
import { Route } from 'react-router';

import CommentaryLayout from '../layouts/CommentaryLayout';
import AddCommentLayout from '../layouts/AddCommentLayout';
import AddRevisionLayout from '../../revisions/layouts/AddRevisionLayout/AddRevisionLayout';

export default (
	<PrivateRoute exact path="/commentary/create" component={AddCommentLayout} />
	<Route exact path="/commentary/:urn?" component={CommentaryLayout} />
	<PrivateRoute exact path="/commentary/:commentId/edit" component={AddRevisionLayout} />
);
