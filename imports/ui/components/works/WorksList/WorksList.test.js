import React from 'react';
import renderer from 'react-test-renderer';

// component:
import WorksList from './WorksList';

describe('WorksList', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<WorksList />
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
