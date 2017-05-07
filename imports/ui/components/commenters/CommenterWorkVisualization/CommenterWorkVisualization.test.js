import React from 'react';
import renderer from 'react-test-renderer';

// component:
import CommenterWorkVisualization from './CommenterWorkVisualization';

describe('CommenterWorkVisualization', () => {
	it('renders correctly', () => {

		const tree = renderer
			.create(
				<CommenterWorkVisualization
					work={{
						title: 'Iliad',
						slug: 'iliad',
						subworks: [{
							title: '1',
							slug: '1',
							n: 1,
						}],
					}}
					commenterSlug="test"
					toggleVisibleWork={() => {}}
					isTest
				/>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
