import React from 'react';
import renderer from 'react-test-renderer';

// component:
import WorkVisualization from './WorkVisualization';

describe('WorkVisualization', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<WorkVisualization
					work={{
						subworks: []
					}}
				/>)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});

// TODO Fix various d3 errors
