import React from 'react';
import { Route } from 'react-router';

export default (
	<PrivateRoute exact path="/tags/:slug/edit" component={EditKeywordLayout} />
	<PrivateRoute exact path="/tags/create" component={AddKeywordLayout} />
	<Route exact path="/tags/:slug" component={KeywordDetail} />
	<Route path="/words" render={() => <KeywordsPage type="word" title="Words" />} />
	<Route path="/ideas" render={() => <KeywordsPage type="idea" title="Ideas" />} />
);
