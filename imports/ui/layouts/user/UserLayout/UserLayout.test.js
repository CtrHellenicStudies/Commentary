import React from 'react';
import renderer from 'react-test-renderer';

// component:
import UserLayout from './UserLayout';

describe('UserLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<UserLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
