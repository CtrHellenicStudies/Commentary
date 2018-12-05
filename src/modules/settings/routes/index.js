import React from 'react';
import { Route } from 'react-router';

// layout
import MainLayout from '../../../layouts/MainLayout';

// components
import SettingEditorContainer from '../containers/SettingEditorContainer';


const adminRoute = (
	<Route path="/admin" render={() => (<MainLayout><SettingEditorContainer /></MainLayout>)} />
);

export {
	adminRoute,
};
