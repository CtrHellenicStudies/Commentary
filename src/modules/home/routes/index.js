import React from 'react';
import { Route } from 'react-router';

import HomeLayout from '../layouts/HomeLayouts/HomeLayout';


export default (
	<Route exact path="/" component={HomeLayout} />
);
