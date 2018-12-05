import React from 'react';
import { shallow } from 'enzyme';
import { BrowserRouter, Switch } from 'react-router-dom';

// component
import PrivateRoute from './PrivateRoute';


describe('PrivateRoute', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<BrowserRouter>
				<Switch>
					<PrivateRoute
						exact
						roles={['commenter', 'editor', 'admin']}
						path="/test"
						component={<div />}
        	/>
				</Switch>
			</BrowserRouter>
		);
		expect(wrapper).toBeDefined();
	});
});
