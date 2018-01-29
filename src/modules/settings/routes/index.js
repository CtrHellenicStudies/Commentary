import React from 'react';
import { Route } from 'react-router';


// components
import SettingEditorContainer from '../containers/SettingEditorContainer';


export default (
	<div>
		<Route exact path="/settings" component={SettingEditorContainer} />
	</div>
);
