import React from 'react';
import { Route } from 'react-router';

// layout
import MainLayout from '../../../layouts/MainLayout';

// components
import SettingEditorContainer from '../containers/SettingEditorContainer';


export default (
	<Route>
		<div>
			<Route path="/admin/" component={MainLayout} />
			<Route path="/admin/settings" component={SettingEditorContainer} />
		</div>
	</Route>
);
