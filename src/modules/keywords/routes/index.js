import React from 'react';
import { Route } from 'react-router';

import PrivateRoute from '../../../routes/PrivateRoute';
import EditKeywordLayout from '../layouts/EditKeywordLayout';
import KeywordPage from '../components/KeywordPage';
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
		component={EditKeywordLayout}
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
			<KeywordPage
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
			<KeywordPage
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
