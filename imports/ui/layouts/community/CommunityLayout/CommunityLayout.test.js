import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommunityLayout from './CommunityLayout';

describe('CommunityLayout', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(<CommunityLayout />)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
