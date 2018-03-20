import React from 'react';
import { Route } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import AddKeywordLayout from '../layouts/AddKeywordLayout/AddKeywordLayout';
import EditKeywordLayout from '../layouts/EditKeywordsLayout/EditKeywordLayout';
import KeywordsPage from '../components/KeywordsPage/KeywordsPage';
import KeywordDetail from '../components/KeywordDetail/KeywordDetail';

export default (
  <Route>
    <div>
    	<PrivateRoute exact path="/tags/:slug/edit" component={EditKeywordLayout} />
    	<PrivateRoute exact path="/tags/create" component={AddKeywordLayout} />
    	<Route exact path="/tags/:slug" component={KeywordDetail} />
    	<Route path="/words" render={() => <KeywordsPage type="word" title="Words" />} />
    	<Route path="/ideas" render={() => <KeywordsPage type="idea" title="Ideas" />} />
    </div>
  </Route>
);
