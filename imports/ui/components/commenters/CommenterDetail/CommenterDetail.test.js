import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommenterDetail from './CommenterDetail';

describe('CommenterDetail', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<CommenterDetail
					slug="test"
					isTest
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
