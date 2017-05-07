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
						title: 'Iliad',
						slug: 'iliad',
						subworks: [{
							title: '1',
							slug: '1',
							n: 1,
						}],
					}}
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
