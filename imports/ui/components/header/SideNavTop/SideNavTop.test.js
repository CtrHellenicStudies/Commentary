import React from 'react';
import renderer from 'react-test-renderer';

// component:
import SideNavTop from './SideNavTop';

describe('SideTopNav', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<SideNavTop />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
