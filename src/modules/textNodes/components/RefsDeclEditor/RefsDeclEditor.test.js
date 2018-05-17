import React from 'react';
import { shallow } from 'enzyme';

// component
import RefsDeclEditor from './RefsDeclEditor';

describe('RefsDeclEditor', () => {
	it('renders correctly', () => {
		const wrapper = shallow(
			<RefsDeclEditor
			/>
		);
		expect(wrapper).toBeDefined();
	});
});
