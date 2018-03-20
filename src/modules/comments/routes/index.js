import React from 'react';
import { Route } from 'react-router';

export default (
	<PrivateRoute exact path="/commentary/create" component={AddCommentLayout} />
	<Route exact path="/commentary/:urn?" component={CommentaryLayout} />
	<PrivateRoute exact path="/commentary/:commentId/edit" component={AddRevisionLayout} />
);
