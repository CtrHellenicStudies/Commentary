import React from 'react';
import { shallow } from 'enzyme';

// component
import ResetPasswordFormContainer from './ResetPasswordFormContainer';

describe('ResetPasswordFormContainer', () => {
	it('renders correctly', () => {

		const wrapper = shallow(<ResetPasswordFormContainer />);
		expect(wrapper).toBeDefined();
	});
});
