import React from 'react';
import { Route } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import AddKeywordLayout from '../layouts/AddKeywordLayout';
import EditKeywordLayout from '../layouts/EditKeywordsLayout';
import KeywordsPage from '../components/KeywordsPage';
import KeywordDetailContainer from '../containers/KeywordDetailContainer';


const editKeywordRoute = (
	<PrivateRoute
		exact
		path="/tags/:slug/edit"
		component={EditKeywordLayout}
		roles={['commenter', 'editor', 'admin']}
	/>
);

const addKeywordRoute = (
	<PrivateRoute
		exact
		path="/tags/create"
		component={AddKeywordLayout}
		roles={['commenter', 'editor', 'admin']}
	/>
);

const keywordDetailRoute = (
	<Route
		exact
		path="/tags/:slug"
		component={KeywordDetailContainer}
	/>
);

const wordsListRoute = (
	<Route
		path="/words"
		render={() => (
			<KeywordsPage
				type="word"
				title="Words"
			/>
		)}
	/>
);

const ideasListRoute = (
	<Route
		path="/ideas"
		render={() => (
			<KeywordsPage
				type="idea"
				title="Ideas"
			/>
		)}
	/>
);

export {
	editKeywordRoute, addKeywordRoute, keywordDetailRoute, wordsListRoute,
	ideasListRoute,
};
