import React from 'react';
import { Route } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import CommentaryLayout from '../layouts/CommentaryLayout';
import AddCommentLayout from '../layouts/AddCommentLayout';
import AddRevisionLayout from '../../revisions/layouts/AddRevisionLayout/AddRevisionLayout';

export default (
  <Route>
    <div>
    	<PrivateRoute exact path="/commentary/create" component={AddCommentLayout} />
    	<Route exact path="/commentary/:urn?" component={CommentaryLayout} />
    	<PrivateRoute exact path="/commentary/:commentId/edit" component={AddRevisionLayout} />
    </div>
  </Route>
);
