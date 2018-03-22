import React from 'react';
import { Route, Switch } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import CommentaryLayout from '../layouts/CommentaryLayout';
import AddCommentLayout from '../layouts/AddCommentLayout';
import AddRevisionLayout from '../../revisions/layouts/AddRevisionLayout/AddRevisionLayout';

export default (
  <Route>
    <Switch>
    	<PrivateRoute
        exact
        path="/commentary/create"
        component={AddCommentLayout}
      />
    	<PrivateRoute
        exact
        path="/commentary/:commentId/edit"
        component={AddRevisionLayout}
      />
    	<Route
        exact
        path="/commentary/:urn?"
        component={CommentaryLayout}
      />
    </Switch>
  </Route>
);
