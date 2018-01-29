import React from 'react';
import { Route } from 'react-router';

// layout
import MainLayout from '../../../layouts/MainLayout';

// components
import SettingEditorContainer from '../containers/SettingEditorContainer';


// TODO: figure out better way of managing layout in react router 4
export default (
	<div>
		<Route exact path="/settings" component={() => (<MainLayout><SettingEditorContainer /></MainLayout>)} />
	</div>
);
