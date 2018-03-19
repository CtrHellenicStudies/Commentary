import React from 'react';
import { shallow } from 'enzyme';

// component
import PWDUpdateFormForV2 from './PWDUpdateFormForV2';

describe('PWDUpdateFormForV2', () => {
	it('renders correctly', () => {

		const wrapper = shallow(<PWDUpdateFormForV2 />);
		expect(wrapper).toBeDefined();
	});
});
