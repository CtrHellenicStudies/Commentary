import React from 'react';
import { shallow } from 'enzyme';

// component:
import MenuItem from './MenuItem';


describe('Login', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<MenuItem to="/"/>
		);
		expect(wrapper).toBeDefined();
	});
});
