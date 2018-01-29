import React from 'react';
import { Route, IndexRoute } from 'react-router';

// layouts
import ProjectLayout from '../../projects/layouts/ProjectLayout';

// components
import TextEditorContainer from '../containers/TextEditorContainer';
import TextDetailContainer from '../containers/TextDetailContainer';
import TextListPageContainer from '../containers/TextListPageContainer';


export default (
	<div>
		<Route path="/settings" component={ProjectLayout}>
			<IndexRoute component={TextEditorContainer} />
		</Route>
	</div>
);
